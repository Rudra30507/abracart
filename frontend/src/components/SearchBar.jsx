import React from 'react';

const categoryOptions = [
  { label: 'All Categories', value: 'All Categories', icon: '⚡' },
  { label: 'Electronics', value: 'Electronics', icon: '💻' },
  { label: 'Fashion', value: 'Fashion', icon: '👗' },
  { label: 'Books', value: 'Books', icon: '📚' },
  { label: 'Home & Kitchen', value: 'Home', icon: '🏠' }
];

const SearchBar = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalResults
}) => {
  return (
    <div className="bg-white/85 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
      
      {/* Top Row: Search Input + Category Dropdown + Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input Box */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#16806A] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search electronics, headphones, books, household staples..."
            className="w-full pl-11 pr-10 py-3 rounded-xl border border-[#E2DAD0] bg-[#FAF8F5] text-[#1F2E29] text-sm focus:bg-white focus:border-[#16806A] focus:ring-4 focus:ring-[#16806A]/10 outline-none transition-all placeholder:text-gray-400 font-medium shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#1F2E29] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="w-full md:w-56 shrink-0">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full py-3 pl-4 pr-10 rounded-xl border border-[#E2DAD0] bg-[#FAF8F5] text-[#1F2E29] text-sm font-semibold focus:bg-white focus:border-[#16806A] focus:ring-4 focus:ring-[#16806A]/10 outline-none transition-all appearance-none cursor-pointer shadow-xs"
            >
              <option value="All Categories">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Books">Books</option>
              <option value="Home">Home & Kitchen</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="w-full md:w-52 shrink-0">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full py-3 pl-4 pr-10 rounded-xl border border-[#E2DAD0] bg-[#FAF8F5] text-[#1F2E29] text-sm font-semibold focus:bg-white focus:border-[#16806A] focus:ring-4 focus:ring-[#16806A]/10 outline-none transition-all appearance-none cursor-pointer shadow-xs"
            >
              <option value="">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Filter Pill Buttons (Amazon / Flipkart Style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-xs font-bold text-[#1F2E29]/60 shrink-0 mr-1">Browse:</span>
        {categoryOptions.map((cat) => {
          const isActive = selectedCategory === cat.value || (cat.value === 'Home' && selectedCategory === 'Home');
          return (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#16806A] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#1F2E29]/80 border border-[#E2DAD0] hover:border-[#16806A]/40 hover:text-[#16806A]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
        {totalResults !== undefined && (
          <span className="ml-auto text-xs font-semibold text-[#1F2E29]/60 shrink-0 hidden sm:inline">
            Showing <strong className="text-[#16806A]">{totalResults}</strong> products
          </span>
        )}
      </div>

    </div>
  );
};

export default SearchBar;
