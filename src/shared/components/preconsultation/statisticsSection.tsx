import React from 'react';
import { Users, Clock, CheckCircle, Activity, TrendingUp, AlertCircle} from 'lucide-react';

// Import des composants partagés
import StatisticsCard from '@data-display/StatisticsCard';
import { StatusBadge } from '@data-display/StatusBadge';

// Import des types partagés
import { Room, Consultation } from '@types/index';

// Import des mocks partagés
import { MockSpecialty } from '@mocks/specialties';

// Import des utils partagés
import { formatWaitTime } from '@utils/statusUtils';

interface PreconsultationStatisticsSectionProps {
  specialites: MockSpecialty[];
  consultationsActives: Consultation[];
  postes: Room[];
  darkMode?: boolean;
}

export const PreconsultationStatisticsSection: React.FC<PreconsultationStatisticsSectionProps> = ({
  specialites,
  consultationsActives,
  postes,
  darkMode = false
}) => {
  // Calculs des statistiques
  const totalPatients = specialites.reduce((total, s) => 
    total + s.medecins.reduce((t, m) => t + m.patients.length, 0), 0
  );

  const patientsEnAttente = specialites.reduce((total, s) => 
    total + s.medecins.reduce((t, m) => 
      t + m.patients.filter((p: any) => p.status === 'waiting').length, 0
    ), 0
  );

  const patientsPrets = specialites.reduce((total, s) => 
    total + s.medecins.reduce((t, m) => 
      t + m.patients.filter((p: any) => p.status === 'ready').length, 0
    ), 0
  );

  const patientsEnPreparation = specialites.reduce((total, s) => 
    total + s.medecins.reduce((t, m) => 
      t + m.patients.filter((p: any) => p.status === 'in_preparation').length, 0
    ), 0
  );

  const consultationsActuelles = consultationsActives.filter(c => c.status === 'active').length;
  const postesActifs = postes.filter(p => p.active).length;
  const postesEnUtilisation = postes.filter(p => p.inConsultation).length;
  const tauxUtilisation = postesActifs > 0 ? Math.round((postesEnUtilisation / postesActifs) * 100) : 0;

  // Statistiques par spécialité
  const statistiquesParSpecialite = specialites.map(specialite => {
    const totalPatientsSpecialite = specialite.medecins.reduce((t, m) => t + m.patients.length, 0);
    const patientsPretsSpecialite = specialite.medecins.reduce((t, m) => 
      t + m.patients.filter((p: any) => p.status === 'ready').length, 0
    );
    const medecinsEnConsultation = specialite.medecins.filter(m => m.enConsultation).length;
    
    return {
      nom: specialite.nom,
      totalPatients: totalPatientsSpecialite,
      patientsPrets: patientsPretsSpecialite,
      medecinsEnConsultation,
      totalMedecins: specialite.medecins.length,
      efficacite: totalPatientsSpecialite > 0 ? Math.round((patientsPretsSpecialite / totalPatientsSpecialite) * 100) : 0
    };
  });

  // Temps d'attente moyen simulé
  const tempsAttenteMoyen = 18; // minutes

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Vue d'ensemble
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatisticsCard
            label="Total patients"
            value={totalPatients}
            valueColor={darkMode ? "text-blue-400" : "text-blue-600"}
            darkMode={darkMode}
          />
          
          <StatisticsCard
            label="Patients prêts"
            value={patientsPrets}
            valueColor={darkMode ? "text-green-400" : "text-green-600"}
            darkMode={darkMode}
          />
          
          <StatisticsCard
            label="En préparation"
            value={patientsEnPreparation}
            valueColor={darkMode ? "text-yellow-400" : "text-yellow-600"}
            darkMode={darkMode}
          />
          
          <StatisticsCard
            label="En attente"
            value={patientsEnAttente}
            valueColor={darkMode ? "text-orange-400" : "text-orange-600"}
            darkMode={darkMode}
          />
          
          <StatisticsCard
            label="Consultations actives"
            value={consultationsActuelles}
            valueColor={darkMode ? "text-purple-400" : "text-purple-600"}
            darkMode={darkMode}
          />
          
          <StatisticsCard
            label="Taux d'utilisation"
            value={`${tauxUtilisation}%`}
            valueColor={tauxUtilisation > 80 ? (darkMode ? "text-red-400" : "text-red-600") : 
                      tauxUtilisation > 60 ? (darkMode ? "text-yellow-400" : "text-yellow-600") : 
                      (darkMode ? "text-green-400" : "text-green-600")}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Indicateurs de performance */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4`}>
        <h4 className={`font-medium text-base mb-3 flex items-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          <Activity className="h-5 w-5 mr-2" />
          Indicateurs de performance
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Temps d'attente moyen
              </span>
              <Clock className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {formatWaitTime(tempsAttenteMoyen)}
            </div>
            <div className="flex items-center mt-1">
              <TrendingUp className={`h-3 w-3 mr-1 ${
                tempsAttenteMoyen <= 15 ? 'text-green-500' : 
                tempsAttenteMoyen <= 25 ? 'text-yellow-500' : 'text-red-500'
              }`} />
              <span className={`text-xs ${
                tempsAttenteMoyen <= 15 ? 'text-green-600' : 
                tempsAttenteMoyen <= 25 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {tempsAttenteMoyen <= 15 ? 'Excellent' : 
                 tempsAttenteMoyen <= 25 ? 'Acceptable' : 'À améliorer'}
              </span>
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Efficacité préparation
              </span>
              <CheckCircle className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {totalPatients > 0 ? Math.round((patientsPrets / totalPatients) * 100) : 0}%
            </div>
            <div className="flex items-center mt-1">
              <StatusBadge 
                type={patientsPrets / totalPatients > 0.8 ? "success" : 
                     patientsPrets / totalPatients > 0.6 ? "warning" : "error"}
                label={patientsPrets / totalPatients > 0.8 ? "Très bien" : 
                      patientsPrets / totalPatients > 0.6 ? "Bien" : "À améliorer"}
                size="xs"
              />
            </div>
          </div>
          
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Postes disponibles
              </span>
              <Users className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {postesActifs - postesEnUtilisation}
            </div>
            <div className="flex items-center mt-1">
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                sur {postesActifs} actifs
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques par spécialité */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4`}>
        <h4 className={`font-medium text-base mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Détail par spécialité
        </h4>
        
        <div className="space-y-3">
          {statistiquesParSpecialite.map((stat, index) => (
            <div key={index} className={`p-3 rounded-lg border ${
              darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {stat.nom}
                </h5>
                <div className="flex items-center space-x-2">
                  {stat.medecinsEnConsultation > 0 && (
                    <StatusBadge 
                      type="info"
                      label={`${stat.medecinsEnConsultation} en consultation`}
                      size="xs"
                    />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Total patients
                  </span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stat.totalPatients}
                  </span>
                </div>
                
                <div>
                  <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Prêts
                  </span>
                  <span className={`font-semibold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    {stat.patientsPrets}
                  </span>
                </div>
                
                <div>
                  <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Médecins
                  </span>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {stat.totalMedecins}
                  </span>
                </div>
                
                <div>
                  <span className={`block text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Efficacité
                  </span>
                  <span className={`font-semibold ${
                    stat.efficacite >= 80 ? (darkMode ? 'text-green-400' : 'text-green-600') :
                    stat.efficacite >= 60 ? (darkMode ? 'text-yellow-400' : 'text-yellow-600') :
                    (darkMode ? 'text-red-400' : 'text-red-600')
                  }`}>
                    {stat.efficacite}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes et recommandations */}
      {(patientsEnAttente > 5 || tauxUtilisation > 90) && (
        <div className={`${darkMode ? 'bg-orange-900 border-orange-700' : 'bg-orange-50 border-orange-200'} border rounded-lg p-4`}>
          <div className="flex items-start">
            <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
            <div>
              <h4 className={`font-medium ${darkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                Recommandations
              </h4>
              <ul className={`mt-2 text-sm ${darkMode ? 'text-orange-300' : 'text-orange-700'} space-y-1`}>
                {patientsEnAttente > 5 && (
                  <li>• {patientsEnAttente} patients en attente - Accélérer les préparations</li>
                )}
                {tauxUtilisation > 90 && (
                  <li>• Taux d'utilisation élevé ({tauxUtilisation}%) - Activer des postes supplémentaires</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};