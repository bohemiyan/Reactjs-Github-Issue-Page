import React, { useState, useCallback, useEffect } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
// import './style.css';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../services/api";

export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [listRepos, setListRepo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  //search localStorage
  useState(() => {
    const repoStorage = localStorage.getItem("repos");

    if (repoStorage) {
      setListRepo(JSON.parse(repoStorage));
    }
  }, []);

  //save infos
  useEffect(() => {
    localStorage.setItem("repos", JSON.stringify(listRepos));
  }, [listRepos]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        setAlert(null);
        try {
          if (newRepo === "") {
            throw new Error("You need put a repository to search");
          }

          const response = await api.get(`repos/${newRepo}`);

          const hasRepo = listRepos.find((repo) => repo.name === newRepo);

          if (hasRepo) {
            throw new Error("Duplicated repository, put a different one");
          }

          const data = {
            name: response.data.full_name,
          };
          setListRepo([...listRepos, data]);
          setNewRepo("");
        } catch (error) {
          setAlert(true);
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      submit();
    },
    [newRepo, listRepos],
  );

  function handleinputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleDelete = useCallback(
    (repo) => {
      const find = listRepos.filter((r) => r.name !== repo);
      setListRepo(find);
    },
    [listRepos],
  );

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        My repositories
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="add repositories : Owner_Name / Repository_name"
          value={newRepo}
          onChange={handleinputChange}
        />

        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {listRepos.map((repo) => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <Link to={`/repo/${encodeURIComponent(repo.name)}`}>
              <FaBars size={20} />
            </Link>
          </li>
        ))}
      </List>
    </Container>
  );
}
