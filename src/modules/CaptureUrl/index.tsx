import { useEffect, useState } from "react";

export const CaptureUrlModule = () => {
  const [currentUrl, setCurrentUrl] = useState<string | undefined>('');
  const [totalVisibleHeight, setTotalVisibleHeight] = useState<number>(0);

  useEffect(() => {
    getActiveUrl();
    getHeightFullPage();
  }, []);


  const getActiveUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      setCurrentUrl(url);
    });
  }

  const getHeightFullPage = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      setTotalVisibleHeight(Number(tab.height));
    })
  }

  const scrollToHeight = (height: number) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      const tabId = tab.id
      chrome.tabs.executeScript(Number(tabId), {
        code: `window.scrollTo({ top: ${height}, behavior: 'smooth' });`
      }, (result) => {
        // Manipule o resultado, se necessário
        console.log(result);
      });
    })
  };

  return (
    <>
      <code>{currentUrl}</code>
      <code>Total Visivel: {totalVisibleHeight}</code>

      <button className="btn-custom" onClick={() => scrollToHeight(totalVisibleHeight * 2)}>Rolar Página</button>
    </>
  );
};
