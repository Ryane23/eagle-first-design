import React, { useState } from 'react';
import { Check, Clock, X, FileText, AlertTriangle, CheckCircle, Eye, User } from 'lucide-react';

type ValidationStatus = 'pending' | 'validated' | 'rejected';

interface Validator {
  id: string;
  name: string;
  role: string;
  canValidate: boolean;
}

interface DocumentValidatorProps {
  documentId: string;
  documentTitle: string;
  documentType: string;
  currentStatus: ValidationStatus;
  requiredValidators: Validator[];
  validatedBy?: { id: string; name: string; timestamp: string }[];
  rejectedBy?: { id: string; name: string; timestamp: string; reason: string }[];
  currentUser: { id: string; name: string; role: string };
  onValidate: (documentId: string, note?: string) => void;
  onReject: (documentId: string, reason: string) => void;
  onPreview?: (documentId: string) => void;
}

const DocumentValidator: React.FC<DocumentValidatorProps> = ({
  documentId,
  documentTitle,
  documentType,
  currentStatus,
  requiredValidators,
  validatedBy = [],
  rejectedBy = [],
  currentUser,
  onValidate,
  onReject,
  onPreview
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [validationNote, setValidationNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  
  // Vérifier si l'utilisateur courant peut valider ce document
  const canCurrentUserValidate = requiredValidators.some(
    validator => validator.id === currentUser.id && validator.canValidate
  );
  
  // Vérifier si l'utilisateur courant a déjà validé ce document
  const hasCurrentUserValidated = validatedBy.some(
    validator => validator.id === currentUser.id
  );
  
  // Vérifier si l'utilisateur courant a déjà rejeté ce document
  const hasCurrentUserRejected = rejectedBy.some(
    rejector => rejector.id === currentUser.id
  );
  
  // Gérer la validation du document
  const handleValidate = () => {
    onValidate(documentId, validationNote);
    setValidationNote('');
  };
  
  // Gérer le rejet du document
  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(documentId, rejectReason);
      setRejectReason('');
      setShowRejectForm(false);
    }
  };
  
  // Obtenir la classe de statut et l'icône
  const getStatusInfo = () => {
    switch (currentStatus) {
      case 'validated':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-500" />,
          label: 'Validé',
          classes: 'bg-green-100 text-green-800 border-green-300'
        };
      case 'rejected':
        return {
          icon: <X className="h-5 w-5 text-red-500" />,
          label: 'Rejeté',
          classes: 'bg-red-100 text-red-800 border-red-300'
        };
      case 'pending':
      default:
        return {
          icon: <Clock className="h-5 w-5 text-yellow-500" />,
          label: 'En attente',
          classes: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className="border rounded-lg overflow-hidden">
      {/* En-tête avec les infos du document */}
      <div className="p-3 bg-gray-50 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <h3 className="font-medium">{documentTitle}</h3>
              <p className="text-sm text-gray-600">Type: {documentType}</p>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-md text-sm flex items-center ${statusInfo.classes}`}>
            {statusInfo.icon}
            <span className="ml-1">{statusInfo.label}</span>
          </div>
        </div>
      </div>
      
      {/* Corps avec information de validation */}
      <div className="p-3">
        {/* Liste des validateurs requis */}
        <div className="mb-3">
          <h4 className="text-sm font-medium mb-2">Validation requise par</h4>
          <div className="space-y-1">
            {requiredValidators.map(validator => {
              const hasValidated = validatedBy.some(v => v.id === validator.id);
              const hasRejected = rejectedBy.some(r => r.id === validator.id);
              
              return (
                <div 
                  key={validator.id} 
                  className="flex items-center justify-between text-sm p-2 rounded-md border"
                >
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <div>
                      <span>{validator.name}</span>
                      <span className="text-xs text-gray-500 ml-1">({validator.role})</span>
                    </div>
                  </div>
                  <div>
                    {hasValidated ? (
                      <span className="flex items-center text-green-600">
                        <Check className="h-4 w-4 mr-1" />
                        Validé
                      </span>
                    ) : hasRejected ? (
                      <span className="flex items-center text-red-600">
                        <X className="h-4 w-4 mr-1" />
                        Rejeté
                      </span>
                    ) : (
                      <span className="flex items-center text-yellow-600">
                        <Clock className="h-4 w-4 mr-1" />
                        En attente
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Historique des validations */}
        {(validatedBy.length > 0 || rejectedBy.length > 0) && (
          <div className="mb-3">
            <h4 className="text-sm font-medium mb-2">Historique</h4>
            
            {validatedBy.map((validator, index) => (
              <div key={`validated-${index}`} className="text-sm p-2 bg-green-50 rounded-md mb-1">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Validé par {validator.name} le {validator.timestamp}</span>
                </div>
              </div>
            ))}
            
            {rejectedBy.map((rejector, index) => (
              <div key={`rejected-${index}`} className="text-sm p-2 bg-red-50 rounded-md mb-1">
                <div className="flex items-center text-red-800">
                  <X className="h-4 w-4 mr-1" />
                  <span>Rejeté par {rejector.name} le {rejector.timestamp}</span>
                </div>
                {rejector.reason && (
                  <div className="mt-1 ml-5 text-red-700">
                    Raison: {rejector.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Actions de validation */}
        {currentStatus === 'pending' && canCurrentUserValidate && !hasCurrentUserValidated && !hasCurrentUserRejected && (
          <div className="mt-4">
            {!showRejectForm ? (
              <>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (optionnelle)
                  </label>
                  <textarea
                    value={validationNote}
                    onChange={(e) => setValidationNote(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={2}
                    placeholder="Ajouter une note de validation..."
                  ></textarea>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleValidate}
                    className="px-3 py-1 bg-green-600 text-white rounded-md flex items-center"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Valider
                  </button>
                  
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Rejeter
                  </button>
                </div>
              </>
            ) : (
              <div className="border border-red-300 rounded-md p-3 bg-red-50">
                <label className="block text-sm font-medium text-red-700 mb-1">
                  Motif du rejet <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2 border border-red-300 rounded-md"
                  rows={2}
                  placeholder="Indiquez la raison du rejet..."
                  required
                ></textarea>
                
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={handleReject}
                    className="px-3 py-1 bg-red-600 text-white rounded-md flex items-center"
                    disabled={!rejectReason.trim()}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Confirmer le rejet
                  </button>
                  
                  <button
                    onClick={() => setShowRejectForm(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md flex items-center"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Bouton d'aperçu */}
        {onPreview && (
          <div className="mt-3">
            <button
              onClick={() => onPreview(documentId)}
              className="w-full px-3 py-2 bg-blue-100 text-blue-800 rounded-md flex items-center justify-center"
            >
              <Eye className="h-4 w-4 mr-1" />
              Aperçu du document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentValidator;