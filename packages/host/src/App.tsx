import { useMemo } from "react";
import {
  InfiniteScrolling,
  DataFetchCache,
  Debounce,
  SortingFilter,
  FileUploadWithProgress,
  FormValidation,
  VirtualizedListScratch,
  UseRefExamples,
} from "remoteApp/components/lld-comps"; // importing comps from remoteApp alias defined in config file of host

const bgColors = [
  "bg-teal-300",
  "bg-green-400",
  "bg-yellow-400",
  "bg-blue-400",
  "bg-orange-300",
  "bg-pink-300",
  "bg-purple-300",
  "bg-sky-400",
  "bg-lime-400",
  "bg-rose-400",
];

function App() {
  const allComponents = useMemo(
    () => [
      {
        title: "Low Level Designs",
        data: [
          {
            name: "Sorting , Searching and Filtering",
            comp: SortingFilter,
            desc: "Component to sort, search, and filter data dynamically.",
          },
          {
            name: "Infinite Scrolling",
            comp: InfiniteScrolling,
            desc: "Load and display data endlessly while scrolling smoothly.",
          },
          {
            name: "Data Fetch with Cache",
            comp: DataFetchCache,
            desc: "Efficient data fetching combined with intelligent caching.",
          },
          {
            name: "Debounce",
            comp: Debounce,
            desc: "Debounce input events to improve performance and UX.",
          },
          {
            name: "File Upload With Progress",
            comp: FileUploadWithProgress,
            desc: "Upload files while visually tracking upload progress.",
          },
          {
            name: "Form Validations",
            comp: FormValidation,
            desc: "Comprehensive form validation with real-time feedback.",
          },
          {
            name: "Virtualized List from Scratch",
            comp: VirtualizedListScratch,
            desc: "Virtualized rendering of long lists for high performance.",
          },
          {
            name: "Stop Watch",
            comp: UseRefExamples,
            desc: "Simple stopwatch component demonstrating useRef usage.",
          },
        ],
      },
    ],
    []
  );

  return (
    <div className="p-4">
      {" "}
      {allComponents.map((section, sectionIdx) => (
        <div key={section.title + sectionIdx} className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black drop-shadow">
            {section.title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {section.data.map((each, idx) => (
              <div
                key={each.name + idx}
                className={`
            rounded-xl shadow-md p-4 group
            ${bgColors[idx % bgColors.length]} 
            flex flex-col min-h-[270px] hover:scale-105 transition-transform
          `}
              >
                <div className="text-lg font-semibold mb-1 text-white drop-shadow">
                  {each.name}
                </div>
                <div className="text-sm text-white/90 mb-4 drop-shadow-sm">
                  {each.desc}
                </div>
                <div className="flex items-end justify-between mt-auto">
                  <span className="bg-green-500 text-white text-xs py-1 px-3 rounded-full flex items-center gap-1">
                    {each.name}
                    <span className="ml-1">🏅</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
