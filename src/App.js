import React, { useState } from 'react'

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !jobDesc) {
      alert("Please upload the resume and enter job description")
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/analyze-resume?job_description=${encodeURIComponent(jobDesc)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }

    setLoading(false)
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-800 via-gray-600 to-gray-800 flex flex-col items-center text-white p-10'>
      <h1 className='text-5xl p-6 mb-4 text-red-600 font-bold'>AI Resume Analyzer</h1>

      <input
        type='file'
        accept='.pdf'
        onChange={(e) => setFile(e.target.files[0])}
        className='mb-4'
      />

      <textarea
        placeholder='Enter Job Description'
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        className='w-full max-w-xl p-5 border rounded-xl text-black mb-4'
        rows="5"
      />

      <button
        onClick={handleSubmit}
        className='bg-blue-500 p-4 mt-3 rounded-xl'>
        Analyze Resume
      </button>

      {loading && <p className='mt-4'>Analyzing.........</p>}

      {result && (
        <div className='mt-6 bg-white p-6 text-black rounded-xl w-full max-w-xl'>
          <p><strong>Match Score:</strong> {result.match_score}%</p>

          <p>
            <strong>Resume Skills:</strong>{" "}
            {result.resume_skills
              ? result.resume_skills.join(", ")
              : "No Skills found"}
          </p>

          <p>
            <strong>Job Skills:</strong>{" "}
            {result.job_skills
              ? result.job_skills.join(", ")
              : "No job skills found"}
          </p>

          <p>
            <strong>Missing Skills:</strong>{" "}
            {result.missing_skills && result.missing_skills.length > 0
              ? result.missing_skills.join(", ")
              : "None"}
          </p>

          <p className="text-green-600 font-bold">
            {result.match_score > 70
              ? "Good Match ✅"
              : result.match_score > 50
                ? "Moderate Match ⚠️"
                : "Low Match ❌"}
          </p>

          <p>
            <strong>Suggestions:</strong>{" "}
            {result.suggestions?.join(", ") || "None"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;