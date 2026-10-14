package URL_ORGANISATION_1_6;

import java.time.LocalDate;
import java.util.logging.Logger;

/**
 * Service de notification - fichier de test pour la detection de donnees sensibles.
 */
public class NotificationService {

    private static final Logger LOGGER = Logger.getLogger(NotificationService.class.getName());

    // Secret en dur (a detecter : SECRET)
    private static final String SECRET_8;
    private static final String SECRET_9;

    // Connexion BDD (a detecter : DB_CONNECTION)
    private static final String DATABASE_URL = "jdbc:mysql://URL_ORGANISATION_1_7";
    private static final String DB_SECRET_10;

    // Urls (a detecter : URL_API / URL_ORGANISATION_1)
    private static final String PORTAIL = "URL_ORGANISATION_1_5";
    private static final String API_PUBLIQUE = "URL_ORGANISATION_1_3";

    // Donnees personnelles (a detecter : EMAIL / NIR / TELEPHONE / DATE)
    private static final String CONTACT = "EMAIL_1";
    private static final String NIR_AGENT = "NIR_2";
    private static final String NIR_CLIENT = "NIR_3";
    private static final String TEL_MOBILE = "TELEPHONE_2";
    private static final String TEL_FIXE = "TELEPHONE_3";

    public void notifier(String message) {
        // Date litterale et date ISO (a detecter : DATE)
        LocalDate dateSignature = LocalDate.parse("DATE_12");
        LOGGER.info("Signature du rapport le DATE_7");

        // Adresse IP et domaine interne (a detecter : IP / INFOS_RESEAU)
        LOGGER.info("Appel depuis le serveur IP_5 vers URL_ORGANISATION_1_8");

        // IDEP (a detecter : IDEP)
        String idepResponsable = "ctess01";
        String idepAgent = "IDEP_1";

        // Organisation (a detecter : ORGANISATION)
        LOGGER.info("Traitement ORGANISATION_1 - Institut national de la statistique et des etudes economiques");

        // Chemin local (a detecter : METADATA_PATHS)
        String cheminRapport = "METADATA_PATHS_3/rapports/recensement_2026.pdf";

        sendMail(CONTACT, message, dateSignature);
    }

    private void sendMail(String destinataire, String corps, LocalDate date) {
        // JWT genere le DATE_8 (a detecter : SECRET / DATE)
        String jwt = "SECRET_11";
        LOGGER.info("Notification envoyee a " + destinataire + " le " + date + " avec jeton " + jwt);
    }
}