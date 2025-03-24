import { Download, Edit, Library, Loader2 } from "lucide-react";
import { useState } from "react";
import { recognize } from "tesseract.js";
import { utils, writeFile } from "xlsx";
import { CardForm } from "./components/CardForm";
import { ImageUpload } from "./components/ImageUpload";
import type { CardFormData, CatalogueCard } from "./types";

function App() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<CatalogueCard[]>([]);
  const [processingProgress, setProcessingProgress] = useState({
    current: 0,
    total: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CatalogueCard | null>(null);

  const extractFields = (text: string): CardFormData => {
    const lines = text.split("\n").filter((line) => line.trim());

    // Extract classification number and call number from first line (left side)
    const firstLine = lines[0]?.trim() || "";
    const callNumberParts = firstLine.split(/\s+/).filter(Boolean);
    const classification_number = callNumberParts[0] || "";
    const call_number = callNumberParts.slice(1).join(" ") || "";
    const barcodes = lines
      .filter((line) => /^\d{5}$/.test(line.trim()))
      .map((line) => line.trim());

    // Extract title and authors (title can be 2-3 lines before the '/')
    let title = "";
    let author = "";
    let additional_authors: string[] = [];
    let additional_authors_as_it_is: string[] = [];

    // Find the line containing '/' which separates title from authors
    const titleEndIndex = lines.findIndex((line) => line.includes("/"));
    if (titleEndIndex > 0) {
      // Get all lines from after call number until the '/' line
      const titleLines = lines.slice(1, titleEndIndex + 1);
      const lastTitleLine = titleLines[titleLines.length - 1];
      const [titlePart] = lastTitleLine.split("/");

      // Combine previous lines with the title part before '/'
      title = [...titleLines.slice(0, -1), titlePart]
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      // Extract authors after the '/'
      const authorsPart = lastTitleLine.split("/")[1];
      if (authorsPart) {
        const authorsBeforeDash = authorsPart.split("--")[0];
        const authors = authorsBeforeDash.split(",").map((a) => a.trim());
        author = authors[0];
        additional_authors = authors.slice(1);
        additional_authors_as_it_is = authors.slice(1);
      }
    }

    // Extract publication info
    const pubLine =
      lines.find((line) => line.includes("--") && line.includes(":")) || "";
    const pubMatch = pubLine.match(/--\s*([^:]+)\s*:\s*([^,]+),\s*(\d{4})/);

    // Extract physical description
    const physicalLine =
      lines.find((line) => line.includes("p.") || line.includes("cm")) || "";
    const pagesMatch = physicalLine.match(/([xiv\d,\s]+p\.)/);
    const dimensionsMatch = physicalLine.match(/(\d+cm)/);

    // Extract ISBN
    const isbnLine = lines.find((line) => line.includes("ISBN")) || "";
    const isbnMatch = isbnLine.match(/ISBN[:\s]*([0-9-]+)/i);

    // Extract subjects (numbered list after ISBN)
    const subjectStartIndex = lines.findIndex((line) => /^\d+\.\s/.test(line));
    const subjects = lines
      .slice(subjectStartIndex)
      .filter((line) => /^\d+\.\s/.test(line))
      .map((line) => line.replace(/^\d+\.\s/, "").trim());

    // Extract notes
    const notes =
      lines.find(
        (line) => line.includes("Includes") || line.includes("bibliographical")
      ) || "";

    // Extract edition
    const editionMatch = text.match(/(\d+(?:st|nd|rd|th)\s+ed)/i);

    return {
      classification_number,
      call_number,
      author,
      title,
      additional_authors,
      additional_authors_as_it_is,
      publication: {
        place: pubMatch?.[1] || "",
        publisher: pubMatch?.[2] || "",
        year: pubMatch?.[3] || "",
      },
      physical_description: {
        pages: pagesMatch?.[1] || "",
        dimensions: dimensionsMatch?.[1] || "",
      },
      edition: editionMatch?.[1] || "",
      notes,
      isbn: isbnMatch?.[1] || "",
      subjects,
      barcodes,
    };
  };

  const processImage = async (file: File): Promise<CardFormData | null> => {
    try {
      const result = await recognize(file, "eng", {
        logger: (m) => console.log(m),
      });

      const cardData = extractFields(result.data.text);
      if (cardData.classification_number || cardData.call_number) {
        return cardData;
      }
      return null;
    } catch (error) {
      console.error("Error processing image:", error);
      return null;
    }
  };

  // const handleImagesUpload = async (files: File[]) => {
  //   setLoading(true);
  //   setProcessingProgress({ current: 0, total: files.length });

  //   const newCards: CatalogueCard[] = [];

  //   for (let i = 0; i < files.length; i++) {
  //     const cardData = await processImage(files[i]);
  //     if (cardData) {
  //       newCards.push({
  //         id: Date.now().toString() + Math.random(),
  //         ...cardData
  //       });
  //     }
  //     setProcessingProgress({ current: i + 1, total: files.length });
  //   }

  //   if (newCards.length > 0) {
  //     setCards(prevCards => [...prevCards, ...newCards]);
  //   }

  //   setLoading(false);
  //   setProcessingProgress({ current: 0, total: 0 });
  // };

  const handleImagesUpload = async (files: File[]) => {
    setLoading(true);
    setProcessingProgress({ current: 0, total: files.length });

    const newCards: CatalogueCard[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const cardData = await processImage(file);

      if (cardData) {
        const imageUrl = URL.createObjectURL(file); // 👈 Create preview URL

        newCards.push({
          id: Date.now().toString() + Math.random(),
          ...cardData, // 👈 Spread all extracted card data
          imgUrl: imageUrl, // 👈 Ensure this is LAST so it overrides any earlier imgUrl
        });
      }

      setProcessingProgress({ current: i + 1, total: files.length });
    }

    if (newCards.length > 0) {
      setCards((prevCards) => [...prevCards, ...newCards]);
    }

    setLoading(false);
    setProcessingProgress({ current: 0, total: 0 });
  };

  const handleExport = () => {
    // const ws = utils.json_to_sheet(cards);
    // const wb = utils.book_new();
    // utils.book_append_sheet(wb, ws, "Catalogue Cards");
    // writeFile(wb, "library-catalogue.xlsx");
    // const cardsForExport = cards.map((card) => ({
    //   ...card,
    //   subjects: card.subjects.join(", "), // Convert subjects array to a comma-separated string
    //   additional_authors: card.additional_authors.join(", "), // Convert additional authors array to a comma-separated string
    //   additional_authors_as_it_is: card.additional_authors_as_it_is.join(", "),
    //   barcodes: card.barcodes.join(", "), // Convert barcodes array to a comma-separated string
    // }));

    // const ws = utils.json_to_sheet(cardsForExport);
    // const wb = utils.book_new();
    // utils.book_append_sheet(wb, ws, "Catalogue Cards");
    // writeFile(wb, "library-catalogue.xlsx");
    
      if (!cards || cards.length === 0) {
        console.error("No data to export.");
        return;
      }
    
      const cardsForExport = cards.map((card) => ({
        ID: card.id,
        Image_URL: card.imgUrl,
        Classification_Number: card.classification_number,
        Call_Number: card.call_number,
        Author: card.author,
        Title: card.title,
        Additional_Authors: card.additional_authors.join(", "),
        Additional_Authors_As_It_Is: card.additional_authors_as_it_is.join(", "),
        Publication_Place: card.publication.place,
        Publication_Publisher: card.publication.publisher,
        Publication_Year: card.publication.year,
        Physical_Pages: card.physical_description.pages,
        Physical_Dimensions: card.physical_description.dimensions,
        Edition: card.edition,
        Notes: card.notes,
        ISBN: card.isbn,
        Subjects: card.subjects.join(", "),
        Barcodes: card.barcodes.join(", "),
      }));
    
      const ws = utils.json_to_sheet(cardsForExport);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Catalogue Cards");
      writeFile(wb, "library-catalogue.xlsx");
    
  };

  const handleEditCard = (card: CatalogueCard) => {
    setSelectedCard(card);
    setShowForm(true);
  };
  const handleChangeCard = (updatedData: CardFormData) => {
    if (selectedCard) {
      setSelectedCard((prev) => (prev ? { ...prev, ...updatedData } : prev)); // Update selectedCard
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCard.id ? { ...card, ...updatedData } : card
        )
      );
    }
  };
  const handleSaveCard = (updatedData: CardFormData) => {
    if (selectedCard) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCard.id ? { ...card, ...updatedData } : card
        )
      );
    }
    setShowForm(false);
    setSelectedCard(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <Library className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Library Catalogue Scanner
            </h1>
          </div>

          <div className="mb-8">
            <ImageUpload
              onImageUpload={handleImagesUpload}
              isBulkProcessing={loading}
            />
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="flex items-center mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">
                  Processing images... ({processingProgress.current} of{" "}
                  {processingProgress.total})
                </span>
              </div>
              <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (processingProgress.current / processingProgress.total) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {cards.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Scanned Cards
                </h2>
                <button
                  onClick={handleExport}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export to Excel
                </button>
              </div>

              <div className="space-y-4">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Left side - Call Number and Barcode */}
                      <div className="w-48 flex flex-col justify-between">
                        <div>
                          <p className="font-mono text-gray-800">
                            {card.classification_number}
                          </p>
                          <p className="font-mono text-gray-800 whitespace-pre-wrap">
                            {card.call_number}
                          </p>
                        </div>
                        {card.barcodes && (
                          <p className="font-mono text-gray-600 mt-4">
                            {card.barcodes}
                          </p>
                        )}
                      </div>

                      {/* Right side - Card Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg whitespace-pre-wrap">
                              {card.title}
                            </h3>
                            <p className="text-gray-600">{card.author}</p>
                          </div>
                          <button
                            onClick={() => handleEditCard(card)}
                            className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-600">
                              {card.publication.publisher},{" "}
                              {card.publication.year}
                            </p>
                          </div>
                          <div>
                            {card.additional_authors.length > 0 && (
                              <div className="mb-2">
                                <p className="text-sm text-gray-500">
                                  Additional Authors:
                                </p>
                                <ul className="list-disc list-inside">
                                  {card.additional_authors.map(
                                    (author, index) => (
                                      <li key={index} className="text-gray-600">
                                        {author}
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                            {card.subjects.length > 0 && (
                              <div>
                                <p className="text-sm text-gray-500">
                                  Subjects:
                                </p>
                                <ul className="list-disc list-inside">
                                  {card.subjects.map((subject, index) => (
                                    <li key={index} className="text-gray-600">
                                      {subject}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        {card.notes && (
                          <p className="mt-2 text-gray-600 text-sm">
                            {card.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && selectedCard && (
        <CardForm
          data={selectedCard}
          onChange={handleChangeCard}
          onClose={() => {
            setShowForm(false);
            setSelectedCard(null);
          }}
          onSave={handleSaveCard}
        />
      )}
    </div>
  );
}

export default App;
