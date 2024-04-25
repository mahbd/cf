"use client";

interface Props {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  search: string;
  onSubmit?: (search: string) => void;
}

const SearchInput = ({ handleChange, search, onSubmit }: Props) => {
  return (
    <div className="form-group">
      <label htmlFor="SearchInput"> Search </label>
      <input
        id="SearchInput"
        className="form-control form-control-sm search-input"
        type="text"
        name="search"
        value={search}
        placeholder="eg: Contest Name"
        onChange={handleChange}
      />
      {search && (
        <button
          type="button"
          className="close text-danger search-close"
          aria-label="Close"
          onClick={onSubmit ? () => onSubmit(search) : undefined}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
