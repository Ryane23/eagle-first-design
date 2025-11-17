import React, { useState, useEffect } from 'react';
import { 
User, Calendar, Clock, Heart, AlertTriangle, Phone, Mail, Info, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Save, X, Send, MessageSquare, BellRing, Check
} from 'lucide-react';

// Importation des composants partagés
// Button Components
// Button Components
import { ActionButton } from '@buttons/ActionButton';
import { ButtonGroup } from '@buttons/ButtonGroup';

// Panel Components
import ExpandablePanel from '@panels/ExpandablePanel';

// Medical Components
import UrgencyLevelIndicator from '@medical/UrgencyLevelIndicator';

// Feedback Components
import ToastNotification from '@feedback/ToastNotification';

// Form Components
import { AppointmentForm } from '@forms/AppointmentForm';

// Modal Components
import { Modal } from '@modals/Modal';

// Common Components
import { ConnectionStatus } from '@common/ConnectionStatus';

// Data Display Components
import { StatusBadge } from '@data-display/StatusBadge';
import DynamicBadge from '@data-display/DynamicBadge';

// Utils
import { formatDate as formatDateISO } from '@utils/dateUtils';
import { 
  validatePhoneCameroon, 
  validateEmail, 
  validateRequired 
} from '@utils/validationUtils';

// Calculators
import { calculateAge } from '@calculators/medicalCalculators';

// Constants
import { 
  SPECIALTY_OPTIONS, 
  EMERGENCY_PRIORITY_LEVELS 
} from '@constants/emergencyConstants';

const FormulairePriseRDV = () => {
 // États du formulaire
 const [formData, setFormData] = useState({
   nom: '',
   prenom: '',
   dateNaissance: '',
   age: '',
   sexe: '',
   telephone: '',
   email: '',
   specialite: '',
   consultantPrefere: '',
   dateRDV: '',
   heureRDV: '',
   niveauUrgence: '',
   justificationUrgence: '',
   notificationSMS: false,
   notificationEmail: false,
   notificationWhatsapp: false
 });
 
 // État de validation du formulaire
 const [validation, setValidation] = useState({
   nom: true,
   prenom: true,
   dateNaissance: true,
   sexe: true,
   telephone: true,
   specialite: true,
   dateRDV: true,
   heureRDV: true,
   niveauUrgence: true,
   justificationUrgence: true
 });
 
 const [formSubmitted, setFormSubmitted] = useState(false);
 const [sectionOuverte, setSectionOuverte] = useState({
   infosPatient: true,
   rdv: true,
   notifications: true
 });
 
 const [showTooltip, setShowTooltip] = useState('');
 const [tempsAttenteEstime, setTempsAttenteEstime] = useState(null);
 const [showSuccessMessage, setShowSuccessMessage] = useState(false);
 const [isOnline, setIsOnline] = useState(true);
 
 // Calendrier et planning
 const [semaineCourante, setSemaineCourante] = useState(0); // 0 = semaine actuelle, 1 = semaine prochaine, etc.
 const [joursAffichage, setJoursAffichage] = useState([]);
 const [horairesDuJour, setHorairesDuJour] = useState([]);
 const [afficherPlanning, setAfficherPlanning] = useState(false);
 
 // Extraction des spécialités depuis les constantes partagées
 const specialites = SPECIALTY_OPTIONS
   .filter(option => option.value !== 'all')
   .map(option => option.label);
 
 // Structure des consultants avec leurs disponibilités
 const consultantsDisponibles = {
   "Cardiologie": [
     { 
       id: 1, 
       nom: "Dr. Kouam", 
       disponible: true, 
       prochaineDisponibilite: "15 min",
       planning: generateMockPlanning(10) // 10 créneaux réservés par semaine
     },
     { 
       id: 2, 
       nom: "Dr. Mbarga", 
       disponible: false, 
       prochaineDisponibilite: "2h30",
       planning: generateMockPlanning(15) // 15 créneaux réservés par semaine
     }
   ],
   "Pédiatrie": [
     { 
       id: 3, 
       nom: "Dr. Nkodo", 
       disponible: true, 
       prochaineDisponibilite: "Immédiat",
       planning: generateMockPlanning(8) // 8 créneaux réservés par semaine
     }
   ],
   "Neurologie": [
     { 
       id: 4, 
       nom: "Dr. Fouda", 
       disponible: true, 
       prochaineDisponibilite: "30 min",
       planning: generateMockPlanning(12) // 12 créneaux réservés par semaine
     }
   ],
   "Dermatologie": [
     { 
       id: 5, 
       nom: "Dr. Beyala", 
       disponible: true, 
       prochaineDisponibilite: "1h15",
       planning: generateMockPlanning(9) // 9 créneaux réservés par semaine
     }
   ],
   "Gynécologie": [
     { 
       id: 6, 
       nom: "Dr. Ngo Bala", 
       disponible: true, 
       prochaineDisponibilite: "45 min",
       planning: generateMockPlanning(13) // 13 créneaux réservés par semaine
     }
   ],
   "Ophtalmologie": [
     { 
       id: 7, 
       nom: "Dr. Etoundi", 
       disponible: false, 
       prochaineDisponibilite: "3h",
       planning: generateMockPlanning(11) // 11 créneaux réservés par semaine
     }
   ],
   "Médecine générale": [
     { 
       id: 8, 
       nom: "Dr. Kamga", 
       disponible: true, 
       prochaineDisponibilite: "20 min",
       planning: generateMockPlanning(14) // 14 créneaux réservés par semaine
     },
     { 
       id: 9, 
       nom: "Dr. Meka", 
       disponible: true, 
       prochaineDisponibilite: "10 min",
       planning: generateMockPlanning(7) // 7 créneaux réservés par semaine
     }
   ]
 };
 
 // Utilisation des descriptions d'urgence depuis les constantes partagées
 const descriptionUrgence = EMERGENCY_PRIORITY_LEVELS.reduce((acc, level) => {
   acc[level.level] = level.description;
   return acc;
 }, {});
 
 // Générer le planning simulé d'un médecin
 function generateMockPlanning(numberOfBookings) {
   const planning = {};
   const today = new Date();
   
   // Ajouter l'horaire de travail standard sur 4 semaines
   for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
     const startOfWeek = new Date(today);
     startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
     
     // Pour chaque jour ouvrable de la semaine (lundi-vendredi)
     for (let dayOffset = 1; dayOffset <= 5; dayOffset++) {
       const currentDate = new Date(startOfWeek);
       currentDate.setDate(startOfWeek.getDate() + dayOffset);
       
       const dateKey = formatDate(currentDate);
       
       // Horaires disponibles pour ce jour
       planning[dateKey] = {
         available: [
           "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
           "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", 
           "15:00", "15:30", "16:00", "16:30"
         ],
         booked: []
       };
     }
   }
   
   // Ajouter des réservations aléatoires
   let bookedCount = 0;
   const dates = Object.keys(planning);
   
   while (bookedCount < numberOfBookings) {
     // Choisir une date aléatoire
     const randomDateIndex = Math.floor(Math.random() * dates.length);
     const randomDate = dates[randomDateIndex];
     
     if (planning[randomDate].available.length > 0) {
       // Choisir un créneau horaire aléatoire
       const randomSlotIndex = Math.floor(Math.random() * planning[randomDate].available.length);
       const randomSlot = planning[randomDate].available[randomSlotIndex];
       
       // Marquer comme réservé
       planning[randomDate].booked.push(randomSlot);
       planning[randomDate].available = planning[randomDate].available.filter(slot => slot !== randomSlot);
       
       bookedCount++;
     }
   }
   
   return planning;
 }
 
 // Gérer la date de rendez-vous et les jours d'affichage
 useEffect(() => {
   const jours = genererJoursSemaine(semaineCourante);
   setJoursAffichage(jours);
   
   // Si une date est sélectionnée et qu'elle n'est pas dans la semaine actuelle, on ajuste
   if (formData.dateRDV) {
     const dateRDV = new Date(formData.dateRDV);
     const dateExisteIndex = jours.findIndex(jour => 
       jour.dateISO === formData.dateRDV
     );
     
     if (dateExisteIndex === -1) {
       // Recherche de la semaine correspondante
       let trovato = false;
       let weekOffset = -2;
       while (!trovato && weekOffset <= 4) {
         const testJours = genererJoursSemaine(weekOffset);
         const dateExisteTest = testJours.findIndex(jour => 
           jour.dateISO === formData.dateRDV
         );
         
         if (dateExisteTest !== -1) {
           setSemaineCourante(weekOffset);
           setJoursAffichage(testJours);
           trovato = true;
         }
         
         weekOffset++;
       }
     }
   }
 }, [semaineCourante, formData.dateRDV]);
 
 // Formater une date en YYYY-MM-DD
 function formatDate(date) {
   return formatDateISO(date, 'iso');
 }
 
 // Générer les jours de la semaine à afficher
 function genererJoursSemaine(weekOffset) {
   const today = new Date();
   const startOfWeek = new Date(today);
   startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));
   
   const jours = [];
   
   for (let i = 0; i < 7; i++) {
     const jour = new Date(startOfWeek);
     jour.setDate(startOfWeek.getDate() + i);
     
     const options = { weekday: 'short' };
     const nomJour = jour.toLocaleDateString('fr-FR', options);
     
     jours.push({
       date: jour,
       jour: jour.getDate(),
       nomJour: nomJour.charAt(0).toUpperCase() + nomJour.slice(1),
       dateISO: formatDate(jour),
       estAujourdhui: formatDate(jour) === formatDate(today)
     });
   }
   
   return jours;
 }
 
 // Obtenir le planning du médecin pour une date spécifique
 function getPlanningMedecinPourDate(date) {
   if (!formData.specialite || !formData.consultantPrefere) return null;
   
   const medecin = consultantsDisponibles[formData.specialite]?.find(
     m => m.nom === formData.consultantPrefere
   );
   
   if (!medecin || !medecin.planning || !medecin.planning[date]) return null;
   
   return medecin.planning[date];
 }
 
 // Obtenir les plages horaires pour un jour sélectionné
 function getHorairesDuJour(date) {
   const planning = getPlanningMedecinPourDate(date);
   
   if (!planning) {
     return {
       available: [],
       booked: []
     };
   }
   
   return planning;
 }
 
 // Calcul automatique de l'âge à partir de la date de naissance
 useEffect(() => {
   if (formData.dateNaissance) {
     const birthDate = new Date(formData.dateNaissance);
     const age = calculateAge(birthDate);
     setFormData(prev => ({ ...prev, age: age.toString() }));
   }
 }, [formData.dateNaissance]);
 
 // Gestion des champs du formulaire
 const handleInputChange = (e) => {
   const { name, value, type, checked } = e.target;
   const newValue = type === 'checkbox' ? checked : value;
   
   setFormData(prev => ({ ...prev, [name]: newValue }));
   
   // Réinitialisation de la validation du champ si modifié après soumission
   if (formSubmitted) {
     setValidation(prev => ({ ...prev, [name]: true }));
   }
   
   // Validation spécifique pour justification d'urgence
   if (name === 'niveauUrgence') {
     // Si niveau d'urgence ≥ 3, justification obligatoire
     if (parseInt(value) >= 3) {
       setValidation(prev => ({ 
         ...prev, 
         justificationUrgence: validateRequired(formData.justificationUrgence)
       }));
     } else {
       // Sinon, la justification n'est pas obligatoire
       setValidation(prev => ({ ...prev, justificationUrgence: true }));
     }
   }
   
   if (name === 'justificationUrgence' && parseInt(formData.niveauUrgence) >= 3) {
     setValidation(prev => ({ 
       ...prev, 
       justificationUrgence: validateRequired(value)
     }));
   }
   
   // Validation du numéro de téléphone camerounais
   if (name === 'telephone') {
     setValidation(prev => ({ ...prev, telephone: value === '' || validatePhoneCameroon(value) }));
   }
   
   // Si la spécialité change, réinitialiser le consultant préféré et l'heure
   if (name === 'specialite') {
     setFormData(prev => ({ ...prev, consultantPrefere: '', heureRDV: '' }));
     setAfficherPlanning(false);
   }
   
   // Si le médecin change, réinitialiser l'heure
   if (name === 'consultantPrefere') {
     setFormData(prev => ({ ...prev, heureRDV: '' }));
     
     // Afficher le planning si un médecin est sélectionné
     if (value) {
       setAfficherPlanning(true);
     } else {
       setAfficherPlanning(false);
     }
   }
 };
 
 // Sélectionner une date et heure depuis le calendrier
 const handleSelectDateHeure = (dateISO, heure) => {
   setFormData(prev => ({ 
     ...prev, 
     dateRDV: dateISO,
     heureRDV: heure
   }));
 };
 
 // Toggle sections du formulaire
 const toggleSection = (section) => {
   setSectionOuverte(prev => ({ ...prev, [section]: !prev[section] }));
 };
 
 // Validation du formulaire
 const validateForm = () => {
   const newValidation = {
     nom: validateRequired(formData.nom),
     prenom: validateRequired(formData.prenom),
     dateNaissance: validateRequired(formData.dateNaissance),
     sexe: validateRequired(formData.sexe),
     telephone: formData.telephone === '' || validatePhoneCameroon(formData.telephone),
     specialite: validateRequired(formData.specialite),
     dateRDV: validateRequired(formData.dateRDV),
     heureRDV: true, // Heure non obligatoire
     niveauUrgence: validateRequired(formData.niveauUrgence),
     justificationUrgence: parseInt(formData.niveauUrgence) >= 3 ? validateRequired(formData.justificationUrgence) : true
   };
   
   setValidation(newValidation);
   setFormSubmitted(true);
   
   return Object.values(newValidation).every(isValid => isValid);
 };
 
 // Soumission du formulaire
 const handleSubmit = () => {
   if (validateForm()) {
     // Simulation d'enregistrement réussi
     setShowSuccessMessage(true);
     
     // En situation réelle, on enverrait les données au serveur ici
     
     setTimeout(() => {
       setShowSuccessMessage(false);
       resetForm();
     }, 3000);
   } else {
     // Ouvrir les sections contenant des erreurs
     const sections = {
       infosPatient: !validation.nom || !validation.prenom || !validation.dateNaissance || !validation.sexe || !validation.telephone,
       rdv: !validation.specialite || !validation.dateRDV || !validation.niveauUrgence || !validation.justificationUrgence
     };
     
     Object.entries(sections).forEach(([section, hasError]) => {
       if (hasError) {
         setSectionOuverte(prev => ({ ...prev, [section]: true }));
       }
     });
     
     // Faire défiler jusqu'à la première erreur
     const firstErrorField = document.querySelector('.field-error');
     if (firstErrorField) {
       firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
     }
   }
 };
 
 // Réinitialisation du formulaire
 const resetForm = () => {
   setFormData({
     nom: '',
     prenom: '',
     dateNaissance: '',
     age: '',
     sexe: '',
     telephone: '',
     email: '',
     specialite: '',
     consultantPrefere: '',
     dateRDV: '',
     heureRDV: '',
     niveauUrgence: '',
     justificationUrgence: '',
     notificationSMS: false,
     notificationEmail: false,
     notificationWhatsapp: false
   });
   
   setValidation({
     nom: true,
     prenom: true,
     dateNaissance: true,
     sexe: true,
     telephone: true,
     specialite: true,
     dateRDV: true,
     heureRDV: true,
     niveauUrgence: true,
     justificationUrgence: true
   });
   
   setFormSubmitted(false);
   setAfficherPlanning(false);
 };
 
 // Calcul du temps d'attente estimé
 useEffect(() => {
   if (formData.specialite && formData.niveauUrgence) {
     // Simulation d'un calcul de temps d'attente
     const baseTime = {
       "Cardiologie": 30,
       "Pédiatrie": 20,
       "Neurologie": 45,
       "Dermatologie": 25, 
       "Gynécologie": 35,
       "Ophtalmologie": 40,
       "Médecine générale": 15
     }[formData.specialite] || 30;
     
     // Ajustement selon le niveau d'urgence
     const urgencyFactor = {
       "1": 1,
       "2": 0.8,
       "3": 0.5,
       "4": 0.3,
       "5": 0.1
     }[formData.niveauUrgence] || 1;
     
     setTempsAttenteEstime(Math.round(baseTime * urgencyFactor));
   } else {
     setTempsAttenteEstime(null);
   }
 }, [formData.specialite, formData.niveauUrgence]);
 
 // Générer la date minimale (aujourd'hui)
 const getMinDate = () => {
   const today = new Date();
   return formatDate(today);
 };
 
 // Affichage d'une infobulle
 const showHelpTooltip = (field) => {
   setShowTooltip(field);
 };
 
 const hideTooltip = () => {
   setShowTooltip('');
 };

 // Formatage des données pour le composant AppointmentForm
 const getAppointmentFormData = () => {
   return {
     patientName: `${formData.prenom} ${formData.nom}`,
     patientAge: formData.age,
     patientGender: formData.sexe,
     doctor: formData.consultantPrefere,
     specialty: formData.specialite,
     date: formData.dateRDV,
     time: formData.heureRDV,
     duration: "30", // Valeur par défaut
     urgencyLevel: formData.niveauUrgence,
     type: "followup", // Valeur par défaut
     notes: formData.justificationUrgence,
     sendReminder: formData.notificationSMS || formData.notificationEmail || formData.notificationWhatsapp,
     reminderType: formData.notificationSMS ? 'sms' : formData.notificationEmail ? 'email' : 'both'
   };
 };
 
 return (
   <div className="bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
     <h2 className="text-xl font-semibold text-blue-600 mb-4 text-center">Prise de rendez-vous</h2>
     
     {/* Statut de connexion */}
     <ConnectionStatus 
       isOnline={isOnline} 
       showControls={false} 
       bandwidth={3.5} 
       className="mb-3" 
     />
     
     {/* Section 1: Informations du patient */}
     <ExpandablePanel 
       title="Informations du patient"
       icon={<User className="h-4 w-4 text-blue-600" />}
       initiallyExpanded={sectionOuverte.infosPatient}
       onToggle={() => toggleSection('infosPatient')}
       className="mb-4"
     >
       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         {/* Nom */}
         <div>
           <label className="block mb-1 text-sm font-medium">
             Nom <span className="text-red-500">*</span>
           </label>
           <input 
             type="text" 
             name="nom" 
             value={formData.nom} 
             onChange={handleInputChange}
             className={`w-full px-2 py-1 text-sm border rounded-md ${!validation.nom && 'border-red-500 field-error'}`} 
           />
           {!validation.nom && (
             <p className="mt-1 text-xs text-red-500">Ce champ est obligatoire</p>
           )}
         </div>
         
         {/* Prénom */}
         <div>
           <label className="block mb-1 text-sm font-medium">
             Prénom <span className="text-red-500">*</span>
           </label>
           <input 
             type="text" 
             name="prenom" 
             value={formData.prenom} 
             onChange={handleInputChange}
             className={`w-full px-2 py-1 text-sm border rounded-md ${!validation.prenom && 'border-red-500 field-error'}`} 
           />
           {!validation.prenom && (
             <p className="mt-1 text-xs text-red-500">Ce champ est obligatoire</p>
           )}
         </div>
         
         {/* Date de naissance */}
         <div>
           <label className="block mb-1 text-sm font-medium">
             Date de naissance <span className="text-red-500">*</span>
           </label>
           <input 
             type="date" 
             name="dateNaissance" 
             value={formData.dateNaissance} 
             onChange={handleInputChange}
             max={getMinDate()}
             className={`w-full px-2 py-1 text-sm border rounded-md ${!validation.dateNaissance && 'border-red-500 field-error'}`} 
           />
           {!validation.dateNaissance && (
             <p className="mt-1 text-xs text-red-500">Ce champ est obligatoire</p>
           )}
         </div>
         
         {/* Âge (calculé automatiquement) */}
         <div>
           <label className="block mb-1 text-sm font-medium">
             Âge
           </label>
           <input 
             type="text" 
             name="age" 
             value={formData.age ? `${formData.age} ans` : ''} 
             readOnly
             className="w-full px-2 py-1 text-sm border rounded-md bg-gray-100 cursor-not-allowed" 
           />
         </div>
         
         {/* Sexe */}
         <div>
           <label className="block mb-1 text-sm font-medium">
             Sexe <span className="text-red-500">*</span>
           </label>
           <select 
             name="sexe" 
             value={formData.sexe} 
             onChange={handleInputChange}
             className={`w-full px-2 py-1 text-sm border rounded-md ${!validation.sexe && 'border-red-500 field-error'}`} 
           >
             <option value="">Sélectionner...</option>
             <option value="M">Masculin</option>
             <option value="F">Féminin</option>
           </select>
           {!validation.sexe && (
             <p className="mt-1 text-xs text-red-500">Ce champ est obligatoire</p>
           )}
         </div>
         
         {/* Téléphone */}
         <div>
           <label className="block mb-1 text-sm font-medium flex items-center">
             <span>Numéro de téléphone</span>
             <div
               className="relative ml-1"
               onMouseEnter={() => showHelpTooltip('telephone')}
               onMouseLeave={hideTooltip}
             >
               <Info className="h-3 w-3 text-gray-400" />
               {showTooltip === 'telephone' && (
                 <div className="absolute left-0 mt-1 p-2 bg-black text-white text-xs rounded shadow-lg z-10 w-44">
                   Format camerounais: 6XXXXXXXX ou 2XXXXXXXX (9 chiffres total).
                 </div>
               )}
             </div>
           </label>
           <input 
             type="tel" 
             name="telephone" 
             value={formData.telephone} 
             onChange={handleInputChange}
             placeholder="6XXXXXXXX ou 2XXXXXXXX"
             className={`w-full px-2 py-1 text-sm border rounded-md ${!validation.telephone && 'border-red-500 field-error'}`} 
           />
           {!validation.telephone && (
             <p className="mt-1 text-xs text-red-500">Format invalide. Utilisez 6XXXXXXXX ou 2XXXXXXXX</p>
           )}
         </div>
         
         {/* Email */}
         <div>
           <label className="block mb-1 text-sm font-medium">
             Email
           </label>
           <input 
             type="email" 
             name="email" 
             value={formData.email} 
             onChange={handleInputChange}
             className="w-full px-2 py-1 text-sm border rounded-md" 
           />
         </div>
       </div>
     </ExpandablePanel>
     
     {/* Section 2: Rendez-vous */}
     <ExpandablePanel 
       title="Détails du rendez-vous"
       icon={<Calendar className="h-4 w-4 text-blue-600" />}
       initiallyExpanded={sectionOuverte.rdv}
       onToggle={() => toggleSection('rdv')}
       className="mb-4"
     >
       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
         {/* Spécialité */}
         <div>
           <label className="block mb-1 text-sm font-medium">
             Spécialité <span className="text-red-500">*</span>
           </label>
           <select 
             name="specialite" 
             value={formData.specialite} 
             onChange={handleInputChange}
             className={`w-full px-2 py-1 text-sm border rounded-md ${!validation.specialite && 'border-red-500 field-error'}`} 
           >
             <option value="">Sélectionner...</option>
             {specialites.map((specialite, index) => (
               <option key={index} value={specialite}>{specialite}</option>
             ))}
           </select>
           {!validation.specialite && (
             <p className="mt-1 text-xs text-red-500">Ce champ est obligatoire</p>
           )}
         </div>
         
         {/* Consultant préféré */}
         <div>
           <label className="block mb-1 text-sm font-medium flex items-center">
             <span>Médecin <span className="text-red-500">*</span></span>
             <div
               className="relative ml-1"
               onMouseEnter={() => showHelpTooltip('medecin')}
               onMouseLeave={hideTooltip}
             >
               <Info className="h-3 w-3 text-gray-400" />
               {showTooltip === 'medecin' && (
                 <div className="absolute left-0 mt-1 p-2 bg-black text-white text-xs rounded shadow-lg z-10 w-60">
                   Sélectionnez un médecin pour voir son planning de disponibilité.
                 </div>
               )}
             </div>
           </label>
           <select 
             name="consultantPrefere" 
             value={formData.consultantPrefere} 
             onChange={handleInputChange}
             disabled={!formData.specialite}
             className={`w-full px-2 py-1 text-sm border rounded-md ${!formData.specialite && 'bg-gray-100 cursor-not-allowed'}`} 
           >
             <option value="">Sélectionner...</option>
             {formData.specialite && consultantsDisponibles[formData.specialite]?.map((medecin) => (
               <option key={medecin.id} value={medecin.nom}>
                 {medecin.nom} {!medecin.disponible && '(Indisponible)'}
               </option>
             ))}
           </select>
           
           {/* Afficher les disponibilités du médecin choisi */}
           {formData.consultantPrefere && (
             <div className="mt-1 text-xs text-gray-600">
               <span className="font-medium">Disponibilité:</span> {
                 consultantsDisponibles[formData.specialite]?.find(m => m.nom === formData.consultantPrefere)?.disponible
                   ? <StatusBadge type="online" label="Disponible" />
                   : <StatusBadge type="offline" label="Indisponible prochainement" />
               }
             </div>
           )}
         </div>
         
         {/* Calendrier de planning du médecin */}
         {afficherPlanning && formData.consultantPrefere && (
           <div className="md:col-span-2 mt-2 border rounded-md">
             <div className="p-2 bg-gray-50 border-b flex justify-between items-center">
               <h4 className="text-sm font-medium flex items-center">
                 <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                 Planning de {formData.consultantPrefere}
               </h4>
               <div className="flex items-center space-x-2 text-sm">
                 <button 
                   onClick={() => setSemaineCourante(semaineCourante - 1)}
                   className="p-1 bg-white border rounded hover:bg-gray-100"
                 >
                   <ChevronLeft size={16} />
                 </button>
                 <span className="font-medium">
                   Semaine du {joursAffichage.length > 0 ? new Date(joursAffichage[0].date).toLocaleDateString() : '...'}
                 </span>
                 <button 
                   onClick={() => setSemaineCourante(semaineCourante + 1)}
                   className="p-1 bg-white border rounded hover:bg-gray-100"
                 >
                   <ChevronRight size={16} />
                 </button>
               </div>
             </div>
             
             {/* Jours de la semaine */}
             <div className="grid grid-cols-7 text-center border-b">
               {joursAffichage.map((jour, index) => (
                 <div 
                   key={index} 
                   className={`p-2 text-xs font-medium ${
                     jour.estAujourdhui ? 'bg-blue-50 text-blue-700' : 
                     (jour.date.getDay() === 0 || jour.date.getDay() === 6) ? 'bg-gray-100 text-gray-500' : ''
                   }`}
                 >
                   <div>{jour.nomJour}</div>
                   <div className="text-sm mt-1">{jour.jour}</div>
                 </div>
               ))}
             </div>
             
             {/* Grille des horaires */}
             <div className="grid grid-cols-7 text-center p-2 gap-2">
               {joursAffichage.map((jour, index) => {
                 const planning = getHorairesDuJour(jour.dateISO);
                 const isWeekend = jour.date.getDay() === 0 || jour.date.getDay() === 6;
                 
                 return (
                   <div 
                     key={index} 
                     className={`text-xs border rounded p-1 ${
                       isWeekend ? 'bg-gray-100' : (
                         jour.dateISO === formData.dateRDV ? 'bg-blue-50 border-blue-300' : ''
                       )
                     }`}
                   >
                     {isWeekend ? (
                       <div className="text-gray-500 py-2">
                         Non disponible
                       </div>
                     ) : planning && (planning.available.length > 0 || planning.booked.length > 0) ? (
                       <div className="space-y-1">
                         {/* Créneaux disponibles */}
                         {planning.available.map((heure, idx) => (
                           <button
                             key={`available-${idx}`}
                             onClick={() => handleSelectDateHeure(jour.dateISO, heure)}
                             className={`w-full py-1 px-2 rounded text-xs ${
                               formData.dateRDV === jour.dateISO && formData.heureRDV === heure
                               ? 'bg-green-600 text-white'
                               : 'bg-green-100 text-green-800 hover:bg-green-200'
                             }`}
                           >
                             {heure}
                           </button>
                         ))}
                         
                         {/* Créneaux réservés */}
                         {planning.booked.map((heure, idx) => (
                           <div
                             key={`booked-${idx}`}
                             className="w-full py-1 px-2 rounded text-xs bg-red-100 text-red-800 opacity-75 line-through"
                           >
                             {heure}
                           </div>
                         ))}
                         
                         {planning.available.length === 0 && planning.booked.length === 0 && (
                           <div className="py-2 text-gray-500">
                             Aucun créneau
                           </div>
                         )}
                       </div>
                     ) : (
                       <div className="py-2 text-gray-500">
                         Aucun créneau
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>
             
             <div className="p-2 text-xs text-gray-600 border-t flex items-center justify-between">
               <div className="flex items-center space-x-4">
                 <div className="flex items-center">
                   <span className="inline-block w-3 h-3 mr-1 bg-green-100 border border-green-800 rounded"></span>
                   <span>Disponible</span>
                 </div>
                 <div className="flex items-center">
                   <span className="inline-block w-3 h-3 mr-1 bg-red-100 border border-red-800 rounded line-through"></span>
                   <span>Réservé</span>
                 </div>
               </div>
               
               {formData.dateRDV && formData.heureRDV && (
                 <div className="font-medium text-blue-600">
                   Sélection: {new Date(formData.dateRDV).toLocaleDateString()} à {formData.heureRDV}
                 </div>
               )}
             </div>
           </div>
         )}
         
         {/* Date rendez-vous (si pas de médecin sélectionné) */}
         {!afficherPlanning && (
           <div>
             <label className="block mb-1 text-sm font-medium">
               Date <span className="text-red-500">*</span>
             </label>
             <input 
               type="date" 
               name="dateRDV" 
               value={formData.dateRDV} 
               onChange={handleInputChange}
               min={getMinDate()}
               className={`w-full px-2 py-1 text-sm border rounded-md ${!validation.dateRDV && 'border-red-500 field-error'}`} 
             />
             {!validation.dateRDV && (
               <p className="mt-1 text-xs text-red-500">Ce champ est obligatoire</p>
             )}
           </div>
         )}
         
         {/* Option sans horaire précis */}
         <div className="mt-2">
           <label className="flex items-center text-sm">
             <input 
               type="checkbox" 
               checked={formData.heureRDV === ''}
               onChange={() => setFormData(prev => ({ ...prev, heureRDV: '' }))}
               className="mr-2" 
             />
             Rendez-vous sans horaire précis
           </label>
           <p className="text-xs text-gray-600 mt-1 ml-5">
             Un horaire vous sera proposé ultérieurement en fonction des disponibilités.
           </p>
         </div>
         
         {/* Niveau d'urgence */}
         <div className="md:col-span-2 mt-2">
           <label className="block mb-1 text-sm font-medium">
             Degré d'urgence <span className="text-red-500">*</span>
           </label>
           <div className="flex gap-1">
             {[1, 2, 3, 4, 5].map((niveau) => (
               <label 
                 key={niveau} 
                 className="flex-1 cursor-pointer"
               >
                 <input 
                   type="radio" 
                   name="niveauUrgence" 
                   value={niveau} 
                   checked={formData.niveauUrgence === niveau.toString()} 
                   onChange={handleInputChange}
                   className="hidden" 
                 />
                 <UrgencyLevelIndicator 
                   level={niveau} 
                   showLabel={true}
                   showNumber={true}
                   className={`w-full p-1 text-center rounded-md ${formData.niveauUrgence === niveau.toString() ? 'ring-2 ring-gray-400' : ''}`}
                 />
               </label>
             ))}
           </div>
           {!validation.niveauUrgence && (
             <p className="mt-1 text-xs text-red-500">Ce champ est obligatoire</p>
           )}
         </div>
         
         {/* Niveau d'urgence (mobile) - Descriptions */}
         <div className="md:hidden text-xs text-gray-600 mb-2">
           {formData.niveauUrgence && (
             <div className="py-1">
               <span className="font-medium">Niveau {formData.niveauUrgence}:</span> {descriptionUrgence[formData.niveauUrgence]}
             </div>
           )}
         </div>
         
         {/* Justification urgence - conditionnellement affiché */}
         {parseInt(formData.niveauUrgence) >= 3 && (
           <div className="md:col-span-2">
             <label className="block mb-1 text-sm font-medium">
               Justification de l'urgence <span className="text-red-500">*</span>
             </label>
             <textarea 
               name="justificationUrgence" 
               value={formData.justificationUrgence} 
               onChange={handleInputChange}
               rows="2"
               className={`w-full px-2 py-1 text-sm border rounded-md ${!validation.justificationUrgence && 'border-red-500 field-error'}`} 
             />
             {!validation.justificationUrgence && (
               <p className="mt-1 text-xs text-red-500">Ce champ est obligatoire pour un niveau d'urgence ≥ 3</p>
             )}
           </div>
         )}
         
         {/* Temps d'attente estimé */}
         {tempsAttenteEstime !== null && (
           <div className="md:col-span-2 mt-2">
             <div className="bg-blue-50 border border-blue-200 rounded-md p-2 text-sm">
               <div className="flex items-center">
                 <Clock className="h-4 w-4 text-blue-600 mr-1" />
                 <div>
                   <span className="font-medium">Temps d'attente estimé:</span> 
                   <span className="text-blue-700 font-bold ml-1">{tempsAttenteEstime} minutes</span>
                 </div>
               </div>
             </div>
           </div>
         )}
       </div>
     </ExpandablePanel>
     
     {/* Section 3: Notifications */}
     <ExpandablePanel 
       title="Notifications au patient"
       icon={<BellRing className="h-4 w-4 text-blue-600" />}
       initiallyExpanded={sectionOuverte.notifications}
       onToggle={() => toggleSection('notifications')}
       className="mb-4"
     >
       <p className="text-sm text-gray-600 mb-2">
         Comment souhaitez-vous que le patient soit informé de son rendez-vous ?
       </p>
       
       <div className="space-y-2">
         <label className="flex items-center space-x-2">
           <input 
             type="checkbox" 
             name="notificationSMS" 
             checked={formData.notificationSMS} 
             onChange={handleInputChange}
             disabled={!formData.telephone}
             className={!formData.telephone ? 'cursor-not-allowed opacity-50' : ''}
           />
           <div className="flex items-center">
             <Phone className="h-4 w-4 text-blue-600 mr-1" />
             <span className="text-sm">SMS</span>
             {!formData.telephone && (
               <span className="ml-2 text-xs text-gray-500">(nécessite un numéro de téléphone)</span>
             )}
           </div>
         </label>
         
         <label className="flex items-center space-x-2">
           <input 
             type="checkbox" 
             name="notificationEmail" 
             checked={formData.notificationEmail} 
             onChange={handleInputChange}
             disabled={!formData.email}
             className={!formData.email ? 'cursor-not-allowed opacity-50' : ''}
           />
           <div className="flex items-center">
             <Mail className="h-4 w-4 text-blue-600 mr-1" />
             <span className="text-sm">Email</span>
             {!formData.email && (
               <span className="ml-2 text-xs text-gray-500">(nécessite une adresse email)</span>
             )}
           </div>
         </label>
         
         <label className="flex items-center space-x-2">
           <input 
             type="checkbox" 
             name="notificationWhatsapp" 
             checked={formData.notificationWhatsapp} 
             onChange={handleInputChange}
             disabled={!formData.telephone}
             className={!formData.telephone ? 'cursor-not-allowed opacity-50' : ''}
           />
           <div className="flex items-center">
             <MessageSquare className="h-4 w-4 text-green-600 mr-1" />
             <span className="text-sm">WhatsApp</span>
             {!formData.telephone && (
               <span className="ml-2 text-xs text-gray-500">(nécessite un numéro de téléphone)</span>
             )}
           </div>
         </label>
       </div>
       
       {(!formData.telephone && !formData.email) && (
         <p className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
           Veuillez fournir un numéro de téléphone ou une adresse email pour activer les notifications.
         </p>
       )}
     </ExpandablePanel>
     
     {/* Boutons d'action */}
     <ButtonGroup className="flex justify-end gap-2 mt-4">
       <ActionButton 
         label="Annuler"
         icon={<X className="h-3 w-3" />}
         variant="secondary"
         onClick={resetForm}
       />
       
       <ActionButton 
         label="Enregistrer le rendez-vous"
         icon={<Save className="h-3 w-3" />}
         variant="primary"
         onClick={handleSubmit}
       />
     </ButtonGroup>
     
     {/* Indicateur champs obligatoires */}
     <div className="mt-3 text-center">
       <p className="text-xs text-gray-500">
         <span className="text-red-500">*</span> Champs obligatoires
       </p>
     </div>
     
     {/* Message de succès */}
     <Modal 
       title="Rendez-vous enregistré" 
       isOpen={showSuccessMessage} 
       onClose={() => setShowSuccessMessage(false)}
       width="max-w-md"
     >
       <div className="text-center">
         <div className="h-12 w-12 mx-auto rounded-full flex items-center justify-center mb-3 bg-green-100 text-green-600">
           <Check className="h-6 w-6" />
         </div>
         
         <p className="mb-2 text-gray-600">
           Rendez-vous confirmé pour {formData.prenom} {formData.nom} le {formData.dateRDV ? new Date(formData.dateRDV).toLocaleDateString() : ''}{formData.heureRDV ? ` à ${formData.heureRDV}` : ' (sans horaire précis)'}.
         </p>
         
         {(formData.notificationSMS || formData.notificationEmail || formData.notificationWhatsapp) && (
           <div className="mt-2 text-sm">
             <p className="font-medium">Le patient sera notifié par :</p>
             <div className="flex justify-center gap-3 mt-1">
               {formData.notificationSMS && <DynamicBadge label="SMS" icon={<Phone className="h-3 w-3" />} variant="info" />}
               {formData.notificationEmail && <DynamicBadge label="Email" icon={<Mail className="h-3 w-3" />} variant="info" />}
               {formData.notificationWhatsapp && <DynamicBadge label="WhatsApp" icon={<MessageSquare className="h-3 w-3" />} variant="success" />}
             </div>
           </div>
         )}
         
         {parseInt(formData.niveauUrgence) >= 3 && (
           <div className="mt-2 p-2 rounded-lg text-sm bg-yellow-50 text-yellow-800">
             <AlertTriangle className="h-4 w-4 inline mr-1" />
             Une validation du niveau d'urgence sera effectuée par la secrétaire principale.
           </div>
         )}
       </div>
     </Modal>
   </div>
 );
};

export default FormulairePriseRDV;