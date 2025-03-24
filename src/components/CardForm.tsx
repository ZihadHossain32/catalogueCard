import { Plus, Trash2, X } from "lucide-react";
import React from "react";
import type { CardFormData } from "../types";

interface CardFormProps {
  data: CardFormData;
  onChange: (data: CardFormData) => void;
  onClose: () => void;
  onSave: (data: CardFormData) => void;
}
export function CardForm({ data, onChange, onClose, onSave }: CardFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handlePublicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      publication: { ...data.publication, [name]: value },
    });
  };

  const handlePhysicalDescriptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...data,
      physical_description: { ...data.physical_description, [name]: value },
    });
  };

  const handleAdditionalAuthorChange = (index: number, value: string) => {
    const newAuthors = [...data.additional_authors];
    newAuthors[index] = value;
    onChange({ ...data, additional_authors: newAuthors });
  };

  const handleSubjectChange = (index: number, value: string) => {
    const newSubjects = [...data.subjects];
    newSubjects[index] = value;
    onChange({ ...data, subjects: newSubjects });
  };

  const addAdditionalAuthor = () => {
    onChange({ ...data, additional_authors: [...data.additional_authors, ""] });
  };

  const addSubject = () => {
    onChange({ ...data, subjects: [...data.subjects, ""] });
  };

  const handleBarcodeChange = (index: number, value: string) => {
    const newBarcodes = [...data.barcodes];
    newBarcodes[index] = value;
    onChange({ ...data, barcodes: newBarcodes });
  };

  const addBarcode = () => {
    onChange({ ...data, barcodes: [...data.barcodes, ""] });
  };

  const removeBarcode = (index: number) => {
    const newBarcodes = data.barcodes.filter((_, i) => i !== index);
    onChange({ ...data, barcodes: newBarcodes });
  };

  const removeAdditionalAuthor = (index: number) => {
    const newAuthors = data.additional_authors.filter((_, i) => i !== index);
    onChange({ ...data, additional_authors: newAuthors });
  };

  const removeSubject = (index: number) => {
    const newSubjects = data.subjects.filter((_, i) => i !== index);
    onChange({ ...data, subjects: newSubjects });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Catalogue Card Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <img src={data.imgUrl} className="w-full" alt="" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <br />
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Classification Number
                  </label>
                  <input
                    type="text"
                    name="classification_number"
                    value={data.classification_number}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Call Number
                  </label>
                  <input
                    type="text"
                    name="call_number"
                    value={data.call_number}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Author
                </label>
                <input
                  type="text"
                  name="author"
                  value={data.author}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Authors
                  </label>
                  <button
                    type="button"
                    onClick={addAdditionalAuthor}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {data.additional_authors.map((author, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={author}
                      onChange={(e) =>
                        handleAdditionalAuthorChange(index, e.target.value)
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalAuthor(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Publication Place
                  </label>
                  <input
                    type="text"
                    name="place"
                    value={data.publication.place}
                    onChange={handlePublicationChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={data.publication.publisher}
                    onChange={handlePublicationChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Publication Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={data.publication.year}
                    onChange={handlePublicationChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Edition
                  </label>
                  <input
                    type="text"
                    name="edition"
                    value={data.edition}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pages
                  </label>
                  <input
                    type="text"
                    name="pages"
                    value={data.physical_description.pages}
                    onChange={handlePhysicalDescriptionChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dimensions
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={data.physical_description.dimensions}
                    onChange={handlePhysicalDescriptionChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ISBN
                </label>
                <input
                  type="text"
                  name="isbn"
                  value={data.isbn}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subjects
                  </label>
                  <button
                    type="button"
                    onClick={addSubject}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {data.subjects.map((subject, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) =>
                        handleSubjectChange(index, e.target.value)
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubject(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Barcodes
                  </label>
                  <button
                    type="button"
                    onClick={addBarcode}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {data.barcodes.map((barcode, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={barcode}
                      onInput={(e) => {
                        const onlyNumbers = e.currentTarget.value.replace(
                          /\D/g,
                          ""
                        );
                        handleBarcodeChange(index, onlyNumbers);
                      }}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeBarcode(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={data.notes}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
