export const calculateAudioDuration = (url: string): Promise<number> => {
  return new Promise((resolve) => {
    // Check if we are running in the browser
    if (typeof window === 'undefined') {
      return resolve(0);
    }
    
    try {
      const audio = new Audio(url);
      
      const handleLoaded = () => {
        resolve(audio.duration);
        cleanup();
      };
      
      const handleError = () => {
        resolve(0);
        cleanup();
      };
      
      const cleanup = () => {
        audio.removeEventListener('loadedmetadata', handleLoaded);
        audio.removeEventListener('error', handleError);
      };
      
      audio.addEventListener('loadedmetadata', handleLoaded);
      audio.addEventListener('error', handleError);
      
      // We don't need to append it to the DOM, just load it
    } catch (e) {
      resolve(0);
    }
  });
};
