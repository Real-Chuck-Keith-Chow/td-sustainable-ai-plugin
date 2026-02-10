import {useState} from 'react'; 
 // THIS IS FROM THE YOUTUBE TUTORIAL -- OURS WILL BE DIFF
const App = () => {
    const [scriptResp, setScriptResp] = useState(null); 

    const getSuggestion = async () => {
         // THIS IS FROM THE YOUTUBE TUTORIAL -- OURS WILL BE DIFF
        // get users 
        const resp = await fetch('https://jsonplaceholder.typicode.com/users'); 
        const users = await resp.json(); 

        // get email 
        const randomEmail = users[Math.floor(Math.random() * users.length)].email; 

        // get active tab 
        const tabs = await chrome.tabs.query({active: true, currentWindow: true}); 
        const activeTab = tabs[0]; 

        //get the response 
        const tabResp= await chrome.tabs.sendMessage(activeTab.id, randomEmail);
        setScriptResp(tabResp)

    };
    return (
        <main>
            <h1> Here is suggestion</h1>
            <button onClick={getSuggestion}> Get Suggestion</button>
            <h2> Content Script Says: {scriptResp}</h2>

        </main>
    );
}
export default App; 