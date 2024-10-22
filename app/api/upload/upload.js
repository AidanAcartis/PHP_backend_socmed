// pages/api/upload.js

import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// To enable form support
export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadFile = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur de parsing' });
        }

        const { user_id } = fields;
        const file = files.file;

        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.filepath));
        formData.append('user_id', user_id);

        // Send a fetch request to upload.php
        try {
            const response = await fetch('http://localhost/Devoi_socila_media/src/backend/models/upload.php', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                return res.status(response.status).json({ message: 'Erreur lors de la communication avec le serveur PHP.' });
            }

            const result = await response.json();
            return res.status(200).json(result);
        } catch (fetchError) {
            return res.status(500).json({ message: 'Erreur lors de l\'envoi de la requête.', error: fetchError });
        }
    });
};

export default uploadFile;
