// client/src/services/auth.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Auth functions
export const loginWithGoogle = async (credential) => {
  try {
    const response = await fetch(`${API_URL}/auth/google`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to authenticate with Google');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to logout');
    }

    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/status`, {
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error('Failed to check auth status');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Auth status check error:', error);
    return null;
  }
};

// Profile functions
export const updateKycStatus = async (status) => {
  try {
    const response = await fetch(`${API_URL}/user/kyc-status`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update KYC status');
    }

    return await response.json();
  } catch (error) {
    console.error('KYC status update error:', error);
    throw error;
  }
};

export const deleteProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Delete profile error:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch profile');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_URL}/user/profile`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    console.error('Profile update error:', error);
    throw error;
  }
};

export const uploadDocument = async (file, documentType) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await fetch(`${API_URL}/user/documents/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload document');
    }

    return await response.json();
  } catch (error) {
    console.error('Document upload error:', error);
    throw error;
  }
};

export const updateCommunicationPreferences = async (preferences) => {
  try {
    const response = await fetch(`${API_URL}/user/preferences`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update communication preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Communication preferences update error:', error);
    throw error;
  }
};

export const updateDocument = async (documentData) => {
  try {
    const response = await fetch(`${API_URL}/user/documents`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(documentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update document');
    }

    return await response.json();
  } catch (error) {
    console.error('Document update error:', error);
    throw error;
  }
};