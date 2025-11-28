import { getApiUrl } from '../config/api.js';

// Call Gemini-powered backend endpoint (example: /api/interview/gemini)
export const fetchGeminiData = async (payload = {}) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(getApiUrl('/api/interview/gemini'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      console.error('Gemini API error:', response.status, response.statusText);
      return null;
    }
    let data = null;
    try {
      data = await response.json();
    } catch (jsonErr) {
      console.error('Gemini response is not valid JSON:', jsonErr);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};
export const fetchInterviewData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(getApiUrl('/api/interview/ping'), {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      return null;
    }
    let data = null;
    try {
      data = await response.json();
    } catch (jsonErr) {
      console.error('Response is not valid JSON:', jsonErr);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const fetchInterviewResult = async (interviewId) => {
  if (!interviewId) return null;
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(getApiUrl(`/api/interview/${interviewId}`), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      }
    });
    if (!response.ok) {
      console.error('Interview result error:', response.status, response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching interview result:', error);
    return null;
  }
};

