export default function FileInput({ onChange, accept = '*' }) {
  return (
    <label className="block border-dashed border-2 border-gray-200 rounded-lg p-6 text-center cursor-pointer">
      <div className="text-sm text-gray-600">Drag & drop or click to upload</div>
      <input type="file" accept={accept} className="hidden" onChange={(e) => onChange(e.target.files[0])} />
    </label>
  );
}