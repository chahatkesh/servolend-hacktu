// client/src/components/auth/GoogleAuthButton.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { loginWithGoogle } from '../../services/auth';

const GoogleAuthButton = () => {
  const { handleLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeGIS = () => {
      try {
        console.log('Initializing Google Identity Services...');
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true // Add support for Intelligent Tracking Prevention
        });

        // Render the button instead of using prompt
        window.google.accounts.id.renderButton(
          document.getElementById('googleButton'),
          { 
            theme: 'outline',
            size: 'large',
            width: document.getElementById('googleButton').offsetWidth,
            text: 'continue_with'
          }
        );

        console.log('Google Identity Services initialized successfully');
      } catch (error) {
        console.error('Error initializing Google Identity Services:', error);
        setError('Failed to initialize Google Sign-In');
      }
    };

    // Load the Google Identity Services script
    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        initializeGIS();
      } else {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGIS;
        script.onerror = (error) => {
          console.error('Failed to load Google Sign-In script:', error);
          setError('Failed to load Google Sign-In');
        };
        document.head.appendChild(script);
      }
    };

    loadGoogleScript();

    return () => {
      // Cleanup
      try {
        window.google?.accounts?.id?.cancel();
      } catch (error) {
        console.error('Error cleaning up Google Identity Services:', error);
      }
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    console.log('Received Google credential response');
    try {
      setIsLoading(true);
      setError(null);

      console.log('Sending credential to backend...');
      const userData = await loginWithGoogle(response.credential);
      console.log('Login successful, updating auth context...');
      
      handleLogin(userData);
    } catch (error) {
      console.error('Google login error:', error);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Container for Google's rendered button */}
      <div 
        id="googleButton"
        className="w-full h-[40px] flex justify-center items-center"
      />
      
      {error && (
        <div className="text-sm text-red-600 text-center" role="alert">
          {error}
          {error.includes('Pop-up blocked') && (
            <div className="mt-2 text-xs">
              Please allow pop-ups for this website in your browser settings and try again.
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default GoogleAuthButton;