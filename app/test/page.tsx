'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [result, setResult] = useState<string>('Click button to test');
  
  const testConnection = async () => {
    setResult('Testing...');
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .eq('has_bar', true)
        .limit(10);
      
      if (error) throw error;
      
      setResult(`Success! Found ${data?.length || 0} hotels with bars`);
      console.log('Hotels:', data);
      
      // Test bars query if we have hotels
      if (data && data.length > 0) {
        const { data: bars, error: barsError } = await supabase
          .from('bars')
          .select('*')
          .eq('hotel_id', data[0].id);
        
        if (barsError) {
          console.warn('Bars query error:', barsError);
        }
        
        console.log('Bars for first hotel:', bars);
        setResult(prev => `${prev}\nFound ${bars?.length || 0} bars for ${data[0].name}`);
      }
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
      console.error(err);
    }
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Supabase Connection Test</h1>
      <button 
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Supabase
      </button>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre>{result}</pre>
      </div>
    </div>
  );
}