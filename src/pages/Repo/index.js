import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FilterList,
} from "./sytles";
import api from "../../services/api";
import { FaArrowLeft } from "react-icons/fa";

export default function Repo() {
  const { repo } = useParams();

  const [selectedRepo, setSelectedRepo] = useState({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState([1,1,1]);
  const [page, setpage] = useState(1);
  const [header, setHeader] = useState("");
  const [closedcount, setClosedcount] = useState(0);
  const [opencount, setOpencount] = useState(0);
  const [States, setStates] = useState("all");
  const [Nextkey, setNextkey] = useState(false);
  const [filterIndex, setfilterIndex] = useState(0);

  const filters= [
  { state: "all", label: "All", active: true },
  { state: "open", label: "Open", active: true },
  { state: "closed", label: "Closed", active: true },
];

 //innitially check for all the issue and set count the issues according their states.
 useEffect(() => {
  async function load() {
    const repoName = decodeURIComponent(repo);
    const [repoData, issuesData] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: filters.find((f) => f.active).state,
          per_page: 5,
        },
      }),
    ]);
    const openCount = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: "open",
      },
    }).then(response => response.data.length);
    const closedCount = await api.get(`/repos/${repoName}/issues`, {
      params: {
        state: "closed",
      },
    }).then(response => response.data.length);
    setSelectedRepo(repoData.data);
    setIssues(issuesData.data.slice(0, 5));
    setOpencount(openCount);
    setClosedcount(closedCount);
    setLoading(false);
  }
  load();
}, [repo]);


//filter out issues acchording their states. 
  useEffect(() => {
    async function loadIssue() {
      const repoName = decodeURIComponent(repo);
      const response = await api.get(`/repos/${repoName}/issues`, {
        params: {
          state:States,
          page,
          per_page: 5,
        },
      });
      setIssues(response.data);
    }
    loadIssue();
  }, [page,States,repo]);

  

 //Control header and next key; 
useEffect(() => {
  const allIss = opencount + closedcount;
  const itemview = page * 5;
  if (States === 'all') {
    setHeader(`All Issue: ${Math.min(itemview, allIss)}/${allIss}`);
    setNextkey(itemview >= allIss);
  } else if (States === 'open') {
    setHeader(`Open Issue: ${Math.min(itemview, opencount)}/${opencount}`);
    setNextkey(itemview >= opencount);
  } else if (States === 'closed') {
    setHeader(`Closed Issue: ${Math.min(itemview, closedcount)}/${closedcount}`);
    setNextkey(itemview >= closedcount);
  }
}, [issues]);


//code to change the page according to state and pagenumber.
  useEffect(() => {
    if(States==="all")
    setpage(pages[0]);
    if(States==="open")
    setpage(pages[1]);
    if(States==="closed")
    setpage(pages[2]); 
   }, [States,pages])


//increment or decrement pages number acchording to states.
function handlePage(action, state) {
  let [allPages, openPages, closedPages] = pages;
  
  switch (state) {
    case "all":
      if (action === "back") allPages--;
      if (action === "next") allPages++;
      break;
    case "open":
      if (action === "back") openPages--;
      if (action === "next") openPages++;
      break;
    case "closed":
      if (action === "back") closedPages--;
      if (action === "next") closedPages++;
      break;
    default:
      break;
  }
  
  setPages([allPages, openPages, closedPages]);
}


   //changes filter
  function handleFilter(index) {
    setStates(filters[index].state);
    setfilterIndex(index);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Loading</h1>
      </Loading>
    );
  }
  return (
    <Container>
      <BackButton to="/">
        <FaArrowLeft color="#000" size={30} />
      </BackButton>
      <Owner>
        <img
          src={selectedRepo.owner.avatar_url}
          alt={selectedRepo.owner.login}
        />
        <h1>{selectedRepo.owner.name}</h1>
        <p>{selectedRepo.description}</p>
      </Owner>
      <FilterList active={filterIndex}>
        {filters.map((filter, index) => (
          <button
            type="button"
            key={filter.label}
            onClick={() => handleFilter(index)}
          >
            {filter.label}
          </button>
        ))}
      </FilterList>
      <div className="count">
        <h3>{header}</h3>
      </div>
      <IssuesList>
        {issues.map((issue) => (
          <li key={String(issue.id)}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />
            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>
              </strong>
            </div>
          </li>
        ))}
      </IssuesList>
      <PageActions>
        <button
          type="button"
          onClick={() => handlePage("back",States)}
          disabled={page < 2}
        >
          Back
        </button>

        <button type="button" 
        onClick={() => handlePage("next",States)}
        disabled={Nextkey}
        
        >
          Next
        </button>
      </PageActions>
    </Container>
  );
}
