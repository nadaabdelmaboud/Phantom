const fs = require('fs');
const { google } = require('googleapis');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

authorize('1lHc2JSZ2_2HOnYPvCMpnt7A9sB0nv788', getFile, 'boards.json'); //param1 frist param send how is in this function fileId
authorize('1Jbr_clduHpxFGnKrLRubIIHtQ8V6Lnzi', getFile, 'topics.json'); //param1 frist param send how is in this function fileId
authorize('1iV9MPyaf8YgkzzhL1hCzKpUchpVHr62z', getFile, 'pins.json'); //param1 frist param send how is in this function fileId
authorize('1jDLISJZeAwE516wpkid4B3MBe7pydK54', getFile, 'images.files.json'); //param1 frist param send how is in this function fileId
authorize('16auwrvRGStcpTQnnhCZ5kO-PN-IrB35X', getFile, 'messages.json'); //param1 frist param send how is in this function fileId
authorize('1v3Ayhlc2vQPXRqfbHmT3L0Ziv3LwyPAW', getFile, 'chats.json'); //param1 frist param send how is in this function fileId

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(param1, callback, param2, param3) {
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        credentials = JSON.parse(content)
        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client, param1, param2); //get file
        });
    });
}

function getFile(auth, fileId, fileName) {
    const drive = google.drive({ version: 'v3', auth });
    var dest = fs.createWriteStream('./' + fileName);
    drive.files.get({ fileId: fileId, alt: 'media' }, { responseType: 'stream' },
        function (err, res) {
            res.data.on('end', () => { console.log('Done'); })
                .on('error', err => { console.log('Error', err); })
                .pipe(dest);
        }
    );

}