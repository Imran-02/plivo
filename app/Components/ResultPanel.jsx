export default function ResultPanel({ result, skill }) {
  if (!result) return (
    <div className="p-4 border rounded h-full text-sm text-gray-500">Results will appear here</div>
  );

  if (skill === 'conversation') {
    return (
      <div className="p-4 border rounded overflow-auto max-h-[420px]">
        <h3 className="font-medium">Transcript</h3>
        <pre className="whitespace-pre-wrap text-sm mt-2 bg-gray-50 p-3 rounded">{result.stt?.text}</pre>

        <h3 className="font-medium mt-4">Diarization</h3>
        <pre className="whitespace-pre-wrap text-sm mt-2 bg-gray-50 p-3 rounded">{JSON.stringify(result.diar, null, 2)}</pre>

        <h3 className="font-medium mt-4">Summary</h3>
        <div className="mt-2 text-sm bg-gray-50 p-3 rounded">{result.summary?.summary || JSON.stringify(result.summary)}</div>
      </div>
    );
  }

  if (skill === 'image') {
    return (
      <div className="p-4 border rounded">
        <h3 className="font-medium">Image description</h3>
        <div className="mt-2 text-sm bg-gray-50 p-3 rounded">{result.image?.description || JSON.stringify(result.image)}</div>
      </div>
    );
  }

  if (skill === 'document') {
    return (
      <div className="p-4 border rounded">
        <h3 className="font-medium">Summary</h3>
        <div className="mt-2 text-sm bg-gray-50 p-3 rounded">{result.doc?.summary || JSON.stringify(result.doc)}</div>
      </div>
    );
  }

  return null;
}