const fs = require('fs');
const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

authorize(undefined, listFiles);

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(param1, callback, param2) {
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        credentials = JSON.parse(content)
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
    });
}


/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    const drive = google.drive({ version: 'v3', auth });
    getList(drive, '');
}

function getList(drive, pageToken) {
    drive.files.list({
        corpora: 'user',
        pageSize: 10,
        pageToken: pageToken ? pageToken : '',
        fields: 'nextPageToken, files(*)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            processList(drive, files);
            if (res.data.nextPageToken) {
                getList(drive, res.data.nextPageToken);
            }
        } else {
            console.log('No files found.');
        }
    });
}

function processList(drive, files) {
    files.forEach(file => {
        if (file.name == 'boards.json'
            || file.name == 'chats.json'
            || file.name == 'messages.json'
            || file.name == 'images.files.json'
            || file.name == 'pins.json'
            || file.name == 'topics.json'
            || file.name == 'pins.json'
            || file.name == 'topics.json'
        )
            getFile(drive, file.id, file.name)
    });
}

function getFile(drive, fileId, fileName) {
    var dest = fs.createWriteStream('./' + fileName);
    drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' },
        function (err, res) {
            res.data
                .on('end', () => { console.log('Done'); })
                .on('error', err => { console.log('Error', err); }).pipe(dest);
        }
    );

}