export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");
        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNote(noteToSave) {
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        // Edit / Update
        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        } else { // Create
            noteToSave.id = notes.length - 1;
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }

        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);
        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }

    static exportNotes() {
        // 1. Récupère toutes les données du localStorage
        const data = JSON.parse(JSON.stringify(localStorage))

        // 2. Convertit les données en chaîne JSON lisible
        const jsonData = JSON.stringify(data, null, 2);

        // 3. Crée un blob (objet fichier) avec le contenu JSON
        const blob = new Blob([jsonData], { type: 'application/json' });

        // 4. Crée un lien temporaire de téléchargement
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'notes.json';
        document.body.appendChild(a);
        a.click();

        // 5. Nettoie le DOM et libère l'objet URL
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    static importNotes() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
            try {
                const json = JSON.parse(e.target.result);

                // Optionnel : vider d'abord le localStorage
                localStorage.clear();

                // Ajout de chaque paire clé/valeur dans le localStorage
                for (const key in json) {
                localStorage.setItem(key, json[key]);
                }

                console.log("Importation JSON réussie !");
                location.reload();
            } catch (err) {
                console.error("Erreur de lecture JSON :", err.message);
            }
            };

            reader.readAsText(file);
        };

        // Déclenche l'ouverture de la fenêtre de fichiers
        input.click();
    }
}