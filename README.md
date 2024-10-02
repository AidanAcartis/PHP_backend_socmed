# PHP_backend_socmed
mon devoir social media
# PHP_backend_socmed
mon devoir social media

Voici une explication rédigée de votre projet utilisant Next.js 14 pour le front-end et PHP en backend :

---

## Explication du Projet

Le projet consiste en une application web construite avec Next.js 14 pour le front-end et PHP pour le backend. Le fonctionnement de l'application repose sur le lancement d'un serveur via la commande `yarn dev`, ce qui permet d'accéder à l'interface utilisateur à l'URL fournie.

### Structure des Fichiers

Le projet utilise plusieurs fichiers essentiels pour la gestion des données :

- **`fichier.txt`** : utilisé pour récupérer des informations spécifiques à partir du backend.
- **`data.json`** : contient des données qui peuvent être manipulées sur le front-end.
- **`post.json`** : sert à récupérer des informations sur les posts à partir de la base de données.

Ces fichiers sont déployés sur le serveur grâce à un script `server.js` qui utilise Express.js pour gérer les requêtes HTTP. Voici un extrait du code de `server.js` :

```javascript
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Activer CORS pour toutes les origines
app.use(cors());

// Définir les routes pour accéder aux fichiers
app.get('/Devoi_socila_media/src/backend/controllers/users/fichier.txt', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/users/fichier.txt');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

// Autres routes pour post.json
app.get('/Devoi_socila_media/src/backend/controllers/posts/post.json', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/posts/post.json');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status || 500).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

// Écoute sur le port 3002
app.listen(3002, () => {
    console.log('Server running on port 3002');
});
```

### Configuration de la Base de Données

Avant de pouvoir interagir avec l'application, il est impératif de créer la base de données dans MySQL et de configurer les tables nécessaires. Assurez-vous que les tables soient correctement reliées pour permettre un fonctionnement fluide de l'application.

Pour relier les tables dans une base de données relationnelle comme MySQL, vous utilisez les clés primaires et les clés étrangères (foreign keys). Voici comment vous pouvez établir les relations entre vos tables `posts`, `users`, `post_reactions`, `comments`, et `comment_reactions` :

### 1. Relier un post à une personne dans la table `users`
Chaque post dans la table `posts` doit être associé à un utilisateur dans la table `users`. Pour cela, la colonne `user_id` dans `posts` fait référence à l'ID de l'utilisateur.

- **Relation** : Un utilisateur peut avoir plusieurs posts (relation un-à-plusieurs).
- **Clé étrangère** : `posts.user_id` est une clé étrangère qui fait référence à `users.id`.

Voici comment vous pourriez déclarer cette relation si vous devez créer la clé étrangère :

```sql
ALTER TABLE posts
ADD CONSTRAINT fk_user_post
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE ON UPDATE CASCADE;
```

- **Explication** : Cela signifie que lorsqu'un utilisateur est supprimé, tous ses posts associés seront également supprimés (`ON DELETE CASCADE`).

### 2. Relier une réaction à un post dans `post_reactions`
La table `post_reactions` doit avoir une colonne qui fait référence à un post dans la table `posts`.

- **Relation** : Un post peut avoir plusieurs réactions (relation un-à-plusieurs).
- **Clé étrangère** : `post_reactions.post_id` fait référence à `posts.id`.

Voici comment créer cette relation :

```sql
ALTER TABLE post_reactions
ADD CONSTRAINT fk_post_reaction
FOREIGN KEY (post_id) REFERENCES posts(id)
ON DELETE CASCADE ON UPDATE CASCADE;
```

### 3. Relier un commentaire à un post dans `comments`
Les commentaires sont associés à des posts, donc la table `comments` doit avoir une colonne qui fait référence à un post dans `posts`.

- **Relation** : Un post peut avoir plusieurs commentaires (relation un-à-plusieurs).
- **Clé étrangère** : `comments.post_id` fait référence à `posts.id`.

Voici comment créer cette relation :

```sql
ALTER TABLE comments
ADD CONSTRAINT fk_post_comment
FOREIGN KEY (post_id) REFERENCES posts(id)
ON DELETE CASCADE ON UPDATE CASCADE;
```

### 4. Relier une réaction à un commentaire dans `comment_reactions`
Les réactions aux commentaires doivent être associées aux commentaires dans la table `comments`.

- **Relation** : Un commentaire peut avoir plusieurs réactions (relation un-à-plusieurs).
- **Clé étrangère** : `comment_reactions.comment_id` fait référence à `comments.id`.

Voici comment créer cette relation :

```sql
ALTER TABLE comment_reactions
ADD CONSTRAINT fk_comment_reaction
FOREIGN KEY (comment_id) REFERENCES comments(id)
ON DELETE CASCADE ON UPDATE CASCADE;
```

### 5. Relier un commentaire à un utilisateur
De même, chaque commentaire dans la table `comments` doit être associé à un utilisateur dans `users`.

- **Relation** : Un utilisateur peut faire plusieurs commentaires (relation un-à-plusieurs).
- **Clé étrangère** : `comments.user_id` fait référence à `users.id`.

Voici comment créer cette relation :

```sql
ALTER TABLE comments
ADD CONSTRAINT fk_user_comment
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE ON UPDATE CASCADE;
```

### Résumé des relations

- **users -> posts** : un utilisateur peut avoir plusieurs posts.
- **posts -> post_reactions** : un post peut avoir plusieurs réactions.
- **posts -> comments** : un post peut avoir plusieurs commentaires.
- **comments -> comment_reactions** : un commentaire peut avoir plusieurs réactions.

### Schéma des tables (résumé)

| Table             | Relation                                   |
|-------------------|--------------------------------------------|
| users             | Un utilisateur peut avoir plusieurs posts et plusieurs commentaires. |
| posts             | Chaque post est lié à un utilisateur (clé étrangère `user_id`). Un post peut avoir plusieurs réactions et plusieurs commentaires. |
| post_reactions    | Chaque réaction est liée à un post (clé étrangère `post_id`). |
| comments          | Chaque commentaire est lié à un post (clé étrangère `post_id`) et à un utilisateur (clé étrangère `user_id`). |
| comment_reactions | Chaque réaction à un commentaire est liée à un commentaire (clé étrangère `comment_id`). |

En utilisant ces relations, vous pouvez gérer efficacement les interactions entre les utilisateurs, leurs posts, les commentaires et les réactions dans votre base de données.

Il semble que votre script `check_session.php` retourne `{"loggedIn":false}` car les valeurs de session ne sont pas définies ou ne persistent pas correctement. Voici quelques étapes à suivre pour diagnostiquer et corriger ce problème :

### Étapes à Suivre

1. **Vérifier les Erreurs de Connexion**
   - Assurez-vous que le script de connexion (`login.php`) est bien appelé et exécuté avant de vérifier la session. Par exemple, assurez-vous qu'il n'y a pas d'erreurs dans `login.php` qui empêcheraient la création de la session.
   - Vous pouvez ajouter des lignes de débogage pour voir si les variables de session sont définies :

   ```php
   if (password_verify($password, $row['password'])) {
       $_SESSION['user_logged_in'] = true;
       $_SESSION['user_id'] = $row['id'];
       error_log("Session variables set: user_logged_in = true, user_id = " . $_SESSION['user_id']);
   } else {
       error_log("Password incorrect for email: " . $email);
   }
   ```

2. **Tester les Cookies**
   - Vous utilisez `setcookie()` pour définir un cookie d'authentification. Assurez-vous que les options de cookie sont configurées correctement, surtout `secure`. Si vous testez sur `http` et que `secure` est à `true`, le cookie ne sera pas créé. Vous pourriez temporairement le définir à `false` pour voir si cela aide.

   ```php
   setcookie('authToken', $authToken, [
       'expires' => time() + 86400, // 1 jour
       'path' => '/',
       'httponly' => true,
       'secure' => false, // Mettre à false pour le test local
       'samesite' => 'Strict'
   ]);
   ```

3. **Vérifier le Code de Vérification de Session**
   - Lorsque vous appelez `check_session.php`, assurez-vous que vous faites cela après avoir tenté de vous connecter avec `login.php`. Par exemple, utilisez une requête AJAX après avoir effectué la connexion pour tester l'état de la session.

4. **Activer le Débogage**
   - Si vous avez des problèmes pour obtenir des messages d'erreur, activez le débogage dans votre fichier de configuration PHP :

   ```php
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

   Cela devrait vous aider à voir s'il y a des erreurs lors de la connexion ou de la vérification des sessions.

5. **Assurez-vous que les Sessions Sont Actives**
   - Vérifiez que les sessions PHP sont activées dans votre `php.ini`. Assurez-vous que les directives suivantes sont présentes et non commentées :

   ```ini
   session.auto_start = 0
   session.save_handler = files
   session.save_path = "/var/lib/php/sessions"
   ```

6. **Testez le Code dans un Navigateur**
   - Ouvrez les outils de développement de votre navigateur (F12) et regardez dans l'onglet "Application" ou "Storage" pour vérifier si les cookies et les sessions sont créés correctement. Vous pouvez également consulter l'onglet "Network" pour voir les requêtes et leurs réponses.

### Conclusion
Après avoir effectué ces vérifications et modifications, faites un test de connexion à nouveau et voyez si vous obtenez `{"loggedIn": true}` lorsque vous vérifiez la session. Si le problème persiste, n’hésitez pas à me faire savoir les détails, et nous continuerons à dépanner le problème.

Voici les étapes détaillées pour résoudre le problème de session dans votre application.

### 1. **Vérification du cookie de session après la connexion**
   - **Objectif :** S'assurer que le cookie de session PHP (`PHPSESSID`) est bien envoyé et stocké dans le navigateur après la connexion.

#### Étapes :
   - Une fois la connexion réussie dans `login.php`, vérifiez que PHP crée bien une session. Ajoutez cette ligne pour forcer la session à être sauvegardée sur le serveur :
     ```php
     session_write_close();
     ```
   - Cela permet de garantir que PHP termine la gestion de la session après avoir défini les variables de session (`$_SESSION['user_logged_in']` et `$_SESSION['user_id']`).

   - **Vérification dans le navigateur :**
     - Ouvrez les outils de développement de votre navigateur (généralement avec `F12`).
     - Allez dans l'onglet `Network`.
     - Réessayez de vous connecter et examinez la requête envoyée à `login.php`.
     - Dans cette requête, vérifiez dans la section `Cookies` si un cookie nommé `PHPSESSID` ou similaire est bien renvoyé par le serveur après la connexion.

#### Exemple de code pour `login.php` :
   ```php
   session_start(); // Démarre la session
   $_SESSION['user_logged_in'] = true;
   $_SESSION['user_id'] = $row['id'];
   
   // Créer un cookie d'authentification
   $authToken = bin2hex(random_bytes(16)); // Générer un token aléatoire
   setcookie('authToken', $authToken, [
       'expires' => time() + 86400, // 1 jour
       'path' => '/',
       'httponly' => true, // Protection contre l'accès JavaScript
       'secure' => false, // Nécessite HTTPS si activé
       'samesite' => 'Strict' // Limite l'envoi du cookie à des requêtes du même site
   ]);

   // Forcer la fermeture de la session
   session_write_close();
   echo json_encode(['success' => true, 'message' => 'connexion réussie', 'username' => $row['username']]);
   exit;
   ```

---

### 2. **Ajout des en-têtes CORS corrects**
   - **Objectif :** Permettre au navigateur d'envoyer des cookies lors des requêtes entre le frontend (`localhost:3000`) et le backend (`localhost`).

#### Étapes :
   - Dans les fichiers `login.php` et `check_session.php`, assurez-vous d'avoir les en-têtes CORS corrects, en particulier `Access-Control-Allow-Credentials: true`.
   - Cela permet au navigateur d'inclure les cookies dans les requêtes `fetch`.

#### Exemple de code pour `login.php` et `check_session.php` :
   ```php
   header("Access-Control-Allow-Origin: http://localhost:3000"); // Modifier en fonction de l'origine
   header("Access-Control-Allow-Credentials: true"); // Permet d'envoyer les cookies
   header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type");
   header("Content-Type: application/json");
   ```

---

### 3. **S'assurer que le frontend gère les cookies**
   - **Objectif :** Lors de l'envoi des requêtes via `fetch`, s'assurer que les cookies (en particulier ceux de session) sont inclus.

#### Étapes :
   - Dans votre fichier JavaScript `actions.js`, vous devez vous assurer que vous avez bien défini l'option `credentials: 'include'` dans la requête `fetch`. Cela permet d'inclure les cookies comme le cookie de session.

#### Exemple de code :
   ```javascript
   const login = async (email, password) => {
     try {
       const response = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/users/login.php', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         credentials: 'include', // Inclut les cookies (notamment PHPSESSID)
         body: JSON.stringify({ email, password }),
       });

       if (response.ok) {
         const sessionResponse = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/users/check_session.php', {
           method: 'GET',
           credentials: 'include', // Inclut également les cookies dans cette requête
         });

         const sessionData = await sessionResponse.json();

         if (sessionData.loggedIn) {
           router.push('/');
         } else {
           throw new Error('Session non valide');
         }
       } else {
         const errorData = await response.json();
         throw new Error(errorData.error || 'Erreur lors de la connexion');
       }
     } catch (error) {
       console.error(error);
       throw error;
     }
   };
   ```

---

### 4. **Vérification de la persistance des sessions côté serveur**
   - **Objectif :** Vérifier que les sessions PHP sont bien persistantes et ne sont pas supprimées immédiatement.

#### Étapes :
   - Assurez-vous que les fichiers de session ne sont pas supprimés trop tôt sur le serveur. Vous pouvez vérifier les fichiers de session dans le répertoire par défaut de PHP (`/var/lib/php/sessions` sur la plupart des systèmes).
   - Vous pouvez également ajuster la durée de vie de la session en modifiant les paramètres suivants dans le fichier `php.ini` :
     ```ini
     session.gc_maxlifetime = 86400  // 24 heures
     session.cookie_lifetime = 86400 // 24 heures
     ```

#### Pour appliquer ces changements :
   - Localisez le fichier `php.ini` (vérifiez avec `phpinfo()` où il se trouve).
   - Modifiez les valeurs pour prolonger la durée de vie des sessions.
   - Redémarrez le serveur Apache pour appliquer les changements :
     ```bash
     sudo service apache2 restart
     ```

---

### 5. **Validation des sessions dans `check_session.php`**
   - **Objectif :** Vérifier si la session est récupérée correctement dans le fichier `check_session.php`.

#### Étapes :
   - Dans `check_session.php`, vérifiez si la session est bien récupérée et si la variable `$_SESSION['user_logged_in']` est définie correctement.

#### Exemple de code pour `check_session.php` :
   ```php
   session_start(); // Démarre la session pour vérifier si elle est valide

   // Vérifiez si l'utilisateur est connecté
   if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
       echo json_encode(['loggedIn' => true, 'userId' => $_SESSION['user_id']]);
   } else {
       echo json_encode(['loggedIn' => false]);
   }
   ```

---

### 6. **Test final :**

#### Étapes :
1. **Connexion :**
   - Essayez de vous connecter via votre frontend.
   - Ouvrez les outils de développement du navigateur (F12) et suivez la requête `login.php` dans l'onglet `Network`. Vérifiez que le cookie de session (comme `PHPSESSID`) est bien défini.

2. **Vérification de session :**
   - Vérifiez que la requête `check_session.php` reçoit le cookie de session et qu'il renvoie bien `loggedIn: true`.

Si toutes ces étapes sont correctement suivies, la session devrait être maintenue entre les différentes requêtes, et l'utilisateur devrait être considéré comme connecté lors de la vérification.

### Gestion des Sessions

Il est également nécessaire de configurer les sessions pour assurer la sécurité et la gestion des utilisateurs. Les détails de configuration peuvent varier, mais vous aurez besoin de fournir un fichier de configuration et de spécifier les paramètres requis pour une session efficace.

### Authentification

L'application impose un processus d'authentification avant que l'utilisateur puisse créer un post ou effectuer d'autres actions. Il est donc nécessaire de passer par un processus de connexion (`login`) après avoir créé un compte (`sign up`). Cela garantit que seules les utilisateurs autorisés peuvent interagir avec les fonctionnalités sensibles de l'application.

---

