
export const loadHistory = () => {
    return null;
    /* let browser = require('../../resources/browser.json');
    return browser.history; */
};

export function saveHistory(json) {
    return null;
    
    /* let browser = require('../../resources/browser.json');
    browser.history = json;

    let filePath = path.join(__dirname.includes('.asar') ? process.resourcesPath : __dirname, '../../resources/browser.json')

    try 
    {
        fs.writeFileSync(filePath, JSON.stringify(browser), 'utf-8'); 
    }
    catch(e) 
    {
        alert('Failed to save the file !' + e); 
    }
    return null; */
};
