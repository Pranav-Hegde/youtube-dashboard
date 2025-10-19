// src/YoutubeAPI.js
import { gapi } from "gapi-script";

const CLIENT_ID = "675622322501-gmlnhifvpdfth1e9v8pr18qd35qqafp5.apps.googleusercontent.com";
const API_KEY = "AIzaSyAgYiPdvaHu1tvNabt71oqVAK3GVKrbTWA";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/youtube.force-ssl";

let gapiClientInitialized = false;

export const initClient = () => {
    return new Promise((resolve, reject) => {
        gapi.load("client:auth2", async () => {
            try {
                if (!gapiClientInitialized) {
                    await gapi.client.init({
                        apiKey: API_KEY,
                        clientId: CLIENT_ID,
                        discoveryDocs: DISCOVERY_DOCS,
                        scope: SCOPES,
                    });
                    gapiClientInitialized = true;
                }
                resolve(gapi.client);
            } catch (err) {
                reject(err);
            }
        });
    });
};

export const signIn = async () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
    }
};

export const signOut = async () => {
    const authInstance = gapi.auth2.getAuthInstance();
    if (authInstance.isSignedIn.get()) {
        await authInstance.signOut();
    }
};

export const fetchMyVideos = async () => {
    const response = await gapi.client.youtube.channels.list({
        part: "contentDetails",
        mine: true,
    });

    const uploadsPlaylistId =
        response.result.items[0].contentDetails.relatedPlaylists.uploads;

    const videosResponse = await gapi.client.youtube.playlistItems.list({
        playlistId: uploadsPlaylistId,
        part: "snippet",
        maxResults: 10,
    });

    return videosResponse.result.items;
};
