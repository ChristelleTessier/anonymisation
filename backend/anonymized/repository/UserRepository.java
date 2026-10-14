package URL_INSEE_11;

import java.net.http.HttpClient;
import java.time.LocalDateTime;

/**
 * Repository utilisateurs - fichier de test pour la detection de donnees sensibles.
 */
public class UserRepository {

    // Secrets (a detecter : SECRET)
    private static final String SECRET_1756f8d9a1e2b3c4d5e6f7\"";
    private static final String PRIVATE_KEY = "SECRET_18\\nMHQCAQEEIIabc...";
    private static final String SECRET_19SECRET_20\"";

    // Connexion BDD (a detecter : DB_CONNECTION)
    private static final String JDBC_URL = "jdbc:oracle:thin:@INFOS_RESEAU_5:1521:QUAL";

    // Donnees personnelles en commentaire (a detecter : EMAIL / NIR / TELEPHONE / IDEP)
    // Agent referent : EMAIL_6 - tel TELEPHONE_6 - NIR NIR_5
    // IDEP : adura00

    /**
     * Recupere le dossier par identifiant.
     */
    public String findById(String id) {
        // Url API et chemin (a detecter : URL_API / METADATA_PATHS)
        String endpoint = "URL_INSEE_12" + id;
        String cacheLocal = "METADATA_PATHS_4/adura00/cache/dossiers.json";

        // Dates (a detecter : DATE)
        LocalDateTime derniereMaj = LocalDateTime.parse("DATE_12T10:15:30");
        System.out.println("Derniere mise a jour le DATE_11 a " + derniereMaj);

        // IP + reseau interne (a detecter : IP / INFOS_RESEAU)
        System.out.println("Noeud de calcul : IP_6 (URL_INSEE_13)");

        return HttpClient.newHttpClient().toString() + endpoint + cacheLocal;
    }
}