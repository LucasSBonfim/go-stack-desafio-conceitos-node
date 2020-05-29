const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = []; 

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
      return response.status(400).json({error : 'Project not found.'})
  }
  return next();
}

app.get("/repositories", (request, response) => {
  const {techs} = request.query;
  console.log(techs)
  const results = techs ? repositories.filter(project => project.techs.includes(techs)) : repositories;
  console.log("Passou ")
  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs = []} = request.body;
  var likes = 0;
  const repository = { id: uuid(), title, url, techs, likes }
  repositories.push(repository)
  return response.json(repository);
});

app.put("/repositories/:id", validateProjectId, (request, response) => {
  const {id} = request.params;
  const {title, url, techs = []} = request.body;
  console.log(request.body)
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  console.log(repositoryIndex);

  var likes = repositories[repositoryIndex].likes;
  const repository = {
      id,
      title,
      url,
      techs,
      likes
  };

  repositories[repositoryIndex] = repository;
  
  return response.json(repository);
});

app.delete("/repositories/:id", validateProjectId, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1)
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateProjectId, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
