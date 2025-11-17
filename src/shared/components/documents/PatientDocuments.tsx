import React, { useState } from 'react';
import { Upload, FileText, X, Download, Eye } from 'lucide-react';

interface PatientDocumentsProps {
  documents: string[];
  onUpdate?: (documents: string[]) => void;
  readOnly?: boolean;
  onView?: (documentName: string) => void;
  onDownload?: (documentName: string) => void;
  darkMode?: boolean;
}

export const PatientDocuments: React.FC<PatientDocumentsProps> = ({
  documents,
  onUpdate,
  readOnly = false,
  onView,
  onDownload,
  darkMode = false
}) => {
  const [newDocument, setNewDocument] = useState<File | null>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (readOnly || !onUpdate) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      addDocument(files[0]);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly || !onUpdate || !e.target.files || e.target.files.length === 0) return;
    
    addDocument(e.target.files[0]);
  };
  
  const addDocument = (file: File) => {
    if (readOnly || !onUpdate) return;
    
    // Dans une application réelle, cela téléchargerait le fichier vers le serveur
    // Pour cette démo, on ajoute simplement le nom du fichier à la liste
    setNewDocument(file);
    onUpdate([...documents, file.name]);
  };
  
  const removeDocument = (index: number) => {
    if (readOnly || !onUpdate) return;
    
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    onUpdate(updatedDocuments);
  };
  
  const handleViewDocument = (documentName: string) => {
    if (onView) {
      onView(documentName);
    }
  };
  
  const handleDownloadDocument = (documentName: string) => {
    if (onDownload) {
      onDownload(documentName);
    }
  };
  
  const getDocumentType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) {
      return 'image';
    } else if (['pdf'].includes(extension || '')) {
      return 'pdf';
    } else if (['doc', 'docx', 'odt'].includes(extension || '')) {
      return 'word';
    } else if (['xls', 'xlsx', 'ods'].includes(extension || '')) {
      return 'excel';
    } else {
      return 'other';
    }
  };

  return (
    <div>
      {!readOnly && (
        <div 
          className={`border-2 border-dashed rounded-md p-3 text-center ${
            darkMode 
              ? 'border-gray-600 hover:border-blue-500' 
              : 'border-gray-300 hover:border-blue-500'
          }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Upload className={`h-8 w-8 mx-auto mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Glisser et déposer les documents ici
          </p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Pièce d'identité, résultats d'examens, etc.
          </p>
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={handleFileSelect}
          />
        </div>
      )}
      
      {documents.length > 0 && (
        <div className={`mt-2 ${readOnly ? '' : 'grid grid-cols-2'} gap-1`}>
          {documents.map((doc, index) => (
            <div 
              key={index}
              className={`px-2 py-1 text-xs rounded-md flex items-center justify-between ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-center overflow-hidden">
                <FileText className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{doc}</span>
              </div>
              <div className="flex space-x-1 flex-shrink-0">
                {(onView || onDownload) && (
                  <>
                    {onView && (
                      <button 
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                        onClick={() => handleViewDocument(doc)}
                        title="Visualiser"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                    )}
                    {onDownload && (
                      <button 
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                        onClick={() => handleDownloadDocument(doc)}
                        title="Télécharger"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                    )}
                  </>
                )}
                {!readOnly && (
                  <button 
                    className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                    onClick={() => removeDocument(index)}
                    title="Supprimer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {documents.length === 0 && (
        <div className={`mt-2 text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Aucun document disponible
        </div>
      )}
    </div>
  );
};