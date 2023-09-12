import axios from "axios";
import { useEffect, useState } from "react";


const CaptureUrlModule: React.FC = () => {
  const [capture, setCapture] = useState<number>(0);
  const [currentUrl, setCurrentUrl] = useState<string | undefined>('');
  const [screenshot, setScreenshot] = useState<string[]>([]); 
  const [isProccessing, setIsProccessing] = useState<boolean>(false);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [msgError, setMsgError] = useState<string | null>(null);
  const [urlDownload, setUrlDownload] = useState<string | null>(null);
  const [ip, setIp] = useState<string>('')

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setIp(data.ip))
      .catch(error => console.log(error))
  }, []);

  useEffect(() => {
    console.log('Screenshot atualizado:', screenshot);
  }, [screenshot]);

  useEffect(() => {
    getActiveUrl(); 
  }, []);

  const getDescription = (value: number) => {
    switch (value) {
      case 1:
        return 'Página completa'
      case 2:
        return 'Área visível'
      default:
        return ''
    }
  }

  const getActiveUrl = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      setCurrentUrl(url);
    });
  }

  const scrollToNextVisibleArea = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      const tabId = Number(tab.id);
  
      await new Promise((resolve) => {
        chrome.scripting.executeScript(
          {
            target: { tabId, allFrames: true },
            files: ['clientside.js'],
          },
        );
      });
    });
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  // const getHeightPage = async () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  //     const tab = tabs[0];
  //     setTotalVisibleHeight(Number(tab.height));
  //   })
  // }

  // const getHeightFullPage = async () => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
  //     const tab = tabs[0];
  //     console.log('==>', tab)
  //     // setTotalFullVisibleHeight(Number(tab.height));
  //   })
  // }

  // const reloadPage = async (tabId: number) => {
  //   chrome.tabs.reload(tabId, {}, () => { })
  // }
  
  const captureScreen = async () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {

      const tab = tabs[0];
      const tabId = tab.id;
      const windowId = tab.windowId;

     // await reloadPage(Number(tabId));

      if (tabId && windowId) {
        chrome.tabs.captureVisibleTab(windowId, {}, (dataUrl) => {
          setScreenshot((prevScreenshot) => [...prevScreenshot, dataUrl]);
        });
      }
    });
    return new Promise((resolve) => setTimeout(resolve, 1000));
  };


  async function executeLoop(value: number) {
    for (let i = 0; i < value; i++) {
      await captureScreen();
      await scrollToNextVisibleArea();
    }
  }
  
  const generateCapture = async () => {
    setIsProccessing(true);
    switch (capture) {
      case 1:
        await executeLoop(6);
        await submitCapture();
        setIsProccessing(false);                                                                                                                                                                             
        break;
      case 2:
        captureScreen();
        await submitCapture();
        setIsProccessing(false);
        break;
      default:
        break;
    }
  }


  const submitCapture = async () => {
    try {
      /**
       * BO: screenshot vai como vázio
       */
      const response = await axios.post('https://exemple.com/api/pdf/generate', {
        images: screenshot,
        currentUrl,
        ip,
      });
  
      if (response.data) {
        setIsFinish(true);
        setUrlDownload(response.data.file);
      } else {
        setMsgError(response?.data?.message);
      }
    } catch (error: any) {
      setMsgError(error?.response?.data?.message);
    }
  };
  
  return (
    <> 
      {msgError && (
        <div role="alert">
          <div className="border border-red-400 rounded-t rounded-b bg-red-100 px-4 py-2 mt-2 text-red-700 text-sm">
            <p>{msgError}</p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center mt-5 mb-5">
        {Array.from({ length: 3 })
          .map((_, index) => (
            <button
              key={index}
              onClick={() => setCapture(index)}
              className={`flex flex-col items-center justify-center flex-1 space-y-1 px-4 py-2 bg-gray-200 text-gray-800 ${capture === index ? 'font-bold' : 'hover:font-bold'}`}
            >
              <span className="text-xs">{getDescription(index)}</span>
            </button>
          ))
          .filter((_, index) => index !== 0)}
      </div>
      {capture !== 0 && (
        <div>
          {isProccessing ? (
            <button type="button" className="btn-custom" disabled>
              Processando...
            </button>
          ) : (
            <>
            {!isFinish ? (
            <button
              onClick={() => generateCapture()}
              type="button"
              className="mt-1 mb-1 w-full bg-transparent hover:bg-blue-800 text-blue-900 font-semibold hover:text-white py-2 px-4 border border-blue-800 hover:border-transparent rounded"
            >
              Iniciar captura <span className="lowercase">{getDescription(capture)}</span>
            </button>
            ): (
              <a
                href={`${urlDownload}`}
                target="_blank"
                className="mt-1 mb-1 w-full bg-transparent hover:bg-blue-800 text-blue-900 font-semibold hover:text-white py-2 px-4 border border-blue-800 hover:border-transparent rounded"
                rel="noreferrer"
                style={{ display: 'block', width: '100%', textDecoration: 'none', textAlign: 'center' }}
              >
                Download do <span className="lowercase">Relatório</span>
              </a>            
              )}
            </>
          )}
        </div>
      )}
      {screenshot.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img
            src={imageUrl}
            alt={`Thumbnail ${index}`}
            className="w-full h-auto rounded cursor-pointer transform transition-transform duration-300 group-hover:scale-105"
          />
          <pre>{imageUrl}</pre>
        </div>
      ))} 
    </>
  );
};                                                                                                           


export default CaptureUrlModule;