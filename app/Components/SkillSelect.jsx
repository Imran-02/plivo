// components/SkillSelector.jsx
export default function SkillSelector({ onSelect }) {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={() => onSelect('conversation')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Conversation Analysis
      </button>
      <button
        onClick={() => onSelect('image')}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Image Analysis
      </button>
      <button
        onClick={() => onSelect('summarization')}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        Document/URL Summarization
      </button>
    </div>
  );
}
