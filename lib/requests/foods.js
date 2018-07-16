const baseURL = require('./qsAPI').baseURL()

const foodsAPIFetch = (id, method, body) => {
  return fetch(`${baseURL}/api/v1/foods/${id}`, {
    method: `${method}`,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
}

const recipesAPIFetch = (id, method, body) => {
  return fetch(`${baseURL}/api/v1/foods/${id}/recipes`, {
    method: `${method}`,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  })
}

const getFoods = () => {
  foodsAPIFetch('', 'GET')
  .then(response => handleResponse(response))
  .then(foods => getEachFood(foods))
  .catch(error => console.error({ error }))
}

const deleteFood = (id, event, removeFoodRow) => {
  foodsAPIFetch(id, 'DELETE')
  .then(response => checkSuccessfulDelete(response, event, removeFoodRow) )
}

const checkSuccessfulDelete = (response, event, removeFoodRow) => {
  if (response.ok) {
    removeFoodRow(event)
  } else {
    var foodName = event.target.parentNode.parentNode.firstElementChild.textContent
    alert(`This food is listed on at least one meal. You must remove "${foodName}" from all meals before deleting.`)
  }
}

const addNewFood = () => {
  var foodName = $('#food-name').val()
  var foodCalories = $('#food-calories').val()

  foodsAPIFetch('', 'POST', { food: { name: foodName, calories: foodCalories } })
  .then(response => handleResponse(response))
  .then(newFood => renderFood(newFood))
  .then(() => clearValues())
  .catch(error => console.error({ error }))
}

const clearValues = () => {
  $('#food-name').val('')
  $('#food-calories').val('')
}

const handleResponse = (response) => {
  return response.json()
    .then(json => {
      if (!response.ok) {
        const error = {
          status: response.status,
          statusTest: response.statusText,
          json
        }
        return Promise.reject(error)
      }
      return json
    })
}

const getEachFood = (foods) => {
  return foods.forEach(food => {
    renderFood(food)
  })
}

const renderFood = (food) => {
  $('#food-table-info').prepend(
   `<article class="food-item-row food-item-${food.id}" data="food-${food.id}">
      <p class="food-item-name" contenteditable="true">${food.name}</p>
      <p class="food-item-calories" contenteditable="true">${food.calories}</p>
      <div class="button-container">
        <button id="food-item-${food.id}" class="food-item-delete-btn" aria-label="Delete">-</button>
      </div>
    </article>`
  )

  recipesAPIFetch(food.id, 'GET')
    .then(response => handleResponse(response))
    .then(recipes => addRecipeLinkToFood(recipes, food))
    .catch(error => console.error({ error }))
}

const addRecipeLinkToFood = (recipes, food) => {
  $(`.food-item-${food.id}`).append(
    `<form action=${recipes.recipes[0].url}>
    <input type="submit" value="See Recipe" />
    </form>`
  )
}

const getEachRecipe = (recipes) => {
  recipes.recipes.forEach(function (recipe, i) {
    renderRecipe(recipe, i)
  })
}

function showPageOne() {
  $(`#recipe-0`).show()
  $(`#recipe-1`).show()
  $(`#recipe-2`).show()
  $(`#recipe-3`).hide()
  $(`#recipe-4`).hide()
  $(`#recipe-5`).hide()
  $(`#recipe-6`).hide()
  $(`#recipe-7`).hide()
  $(`#recipe-8`).hide()
  $(`#recipe-9`).hide()
}
function showPageTwo() {
  $(`#recipe-0`).hide()
  $(`#recipe-1`).hide()
  $(`#recipe-2`).hide()
  $(`#recipe-3`).show()
  $(`#recipe-4`).show()
  $(`#recipe-5`).show()
  $(`#recipe-6`).hide()
  $(`#recipe-7`).hide()
  $(`#recipe-8`).hide()
  $(`#recipe-9`).hide()
}
function showPageThree() {
  $(`#recipe-0`).hide()
  $(`#recipe-1`).hide()
  $(`#recipe-2`).hide()
  $(`#recipe-3`).hide()
  $(`#recipe-4`).hide()
  $(`#recipe-5`).hide()
  $(`#recipe-6`).show()
  $(`#recipe-7`).show()
  $(`#recipe-8`).show()
  $(`#recipe-9`).hide()
}
function showPageFour() {
  $(`#recipe-0`).hide()
  $(`#recipe-1`).hide()
  $(`#recipe-2`).hide()
  $(`#recipe-3`).hide()
  $(`#recipe-4`).hide()
  $(`#recipe-5`).hide()
  $(`#recipe-6`).hide()
  $(`#recipe-7`).hide()
  $(`#recipe-8`).hide()
  $(`#recipe-9`).show()
}

const renderRecipe = (recipe, i) => {
  $('.recipes').append(
   `<li id=recipe-${i}>
      <p>Recipe name: ${recipe.name}</p>
      <a href=${recipe.url}>Recipe link</a>
    </li>`
  )
  if (i > 2) {
    $(`#recipe-${i}`).hide()
  }
}

const updateFood = (id) => {
  var foodName = $(`.food-item-${id}`).children()[0].innerText
  var foodCalories = $(`.food-item-${id}`).children()[1].innerText
  foodsAPIFetch(id, 'PUT', { food: { name: foodName, calories: foodCalories } })
  .then(response => handleResponse(response))
  .catch(error => console.error({ error }))
}

const getRecipes = () => {
  var current_food = window.location.search.split('=')[1]
  recipesAPIFetch(current_food, 'GET')
    .then(response => handleResponse(response))
    .then(recipes => getEachRecipe(recipes))
    .catch(error => console.error({ error }))
}

module.exports = {
  getFoods,
  deleteFood,
  addNewFood,
  updateFood,
  foodsAPIFetch,
  getRecipes,
  recipesAPIFetch,
  addRecipeLinkToFood,
  showPageOne,
  showPageTwo,
  showPageThree,
  showPageFour
}
