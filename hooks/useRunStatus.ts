import {useState, useEffect} from 'react';
import {runFinishedStates} from "./constants";

export const useRunStatus = (run) => {
    const [status, setStatus] = useState(''); // Initialize with an empty string
    const [processing, setProcessing] = useState(false);
    
    useEffect(() => {
       if (run?.status === "in_progress") {
           setStatus("Mengetik...");
       } else if (run?.status === "queued") {
           setStatus("Queued ...");
       } else {
           setStatus(''); // Set back to an empty string
       }
    }, [run]);
    
    useEffect(() => {
        setProcessing(!runFinishedStates.includes(run?.status ?? "completed"));
    }, [run]);

    return {status, processing};
};