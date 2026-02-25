
// This service handles interactions with GitHub (Database) and Google Services (Docs, Drive)
// Based on the "GitHub-Powered Ebook Studio" architecture.

const GITHUB_API_BASE = "https://api.github.com";
const REPO_OWNER = "cowritter";
const REPO_NAME = "user-data";

// --- GitHub as Database ---

export const getUserGithubToken = (): string | null => {
    // In a real implementation, this would retrieve the secure token stored after OAuth
    return localStorage.getItem('github_access_token');
};

export const saveUserDataToGitHub = async (username: string, data: any): Promise<{success: boolean, message?: string, url?: string}> => {
  const token = getUserGithubToken();
  
  // SIMULATION MODE: Persist to LocalStorage to mimic a deployed site
  // This allows the "Live Site" (HostingPreviewPage) to actually load this data in a new tab.
  try {
      // Key format: cowritter_site_{slug}
      localStorage.setItem(`cowritter_site_${username}`, JSON.stringify(data));
      
      // Simulate network latency
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return { 
          success: true, 
          message: "Deployed to GitHub Pages",
          url: `https://co-writter.github.io/${username}`
      };
  } catch (e) {
      console.error("Deployment failed", e);
      return { success: false, message: "Storage Error" };
  }
};

export const loadUserProfileFromGitHub = async (username: string) => {
    // 1. Try to load from our Simulated "Cloud" (LocalStorage)
    try {
        const localData = localStorage.getItem(`cowritter_site_${username}`);
        if (localData) {
            return JSON.parse(localData);
        }
    } catch (e) {
        console.warn("Failed to load from local storage simulation");
    }

    // 2. Real GitHub Fetch (Fallthrough for production)
    try {
        const response = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/users/${username}.json`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error("Failed to load profile from GitHub:", error);
        return null;
    }
};

// --- Google Integrations ---

export const getGoogleAccessToken = (): string | null => {
    // In production, manage this via Google Identity Services token client
    return localStorage.getItem('google_access_token');
};

export const exportToGoogleDocs = async (content: string, title: string): Promise<string> => {
  const accessToken = getGoogleAccessToken();
  
  if (!accessToken) {
      console.log("Simulating Google Docs Export...");
      await new Promise(r => setTimeout(r, 1500));
      return "https://docs.google.com/document/d/simulated_doc_id/edit";
  }
  
  try {
      const response = await fetch('https://docs.googleapis.com/v1/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title
        })
      });
      
      const doc = await response.json();
      const docId = doc.documentId;

      // Insert Content
      await fetch(`https://docs.googleapis.com/v1/documents/${docId}:batchUpdate`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              requests: [{
                  insertText: {
                      text: content,
                      location: { index: 1 }
                  }
              }]
          })
      });

      return `https://docs.google.com/document/d/${docId}/edit`;
  } catch (error) {
      console.error("Google Docs Export Failed:", error);
      throw error;
  }
};

export const backupToDrive = async (filename: string, data: any) => {
    const accessToken = getGoogleAccessToken();
    if (!accessToken) {
        console.log("Simulating Drive Backup...");
        return;
    }

    const metadata = {
        name: filename,
        mimeType: 'application/json',
        parents: ['appDataFolder'] // App specific folder
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([JSON.stringify(data)], { type: 'application/json' }));

    await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: form
    });
};
