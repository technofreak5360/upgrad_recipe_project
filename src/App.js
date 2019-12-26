import React, { Component } from 'react';
//import { render } from 'react-dom';
import './style.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      search: '',
      myRecipe: {},
      image: '',
      loadingState: null,
    };
  }

  //Sets the name of search object
  setName = (event) =>{
    this.setState({
      search: event.target.value
    })
  };

  //function to fetch the object corresponding to search
  getRecipe = async() =>{
    this.setState({
      loadingState: 'LOADING'
    })
    console.log(this.state.search)
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${this.state.search}`);

    const myJson = await response.json();
    console.log("myJson" , myJson);

    //if fetched object is null
    if(myJson.meals == null) {    
  this.setState({
    loadingState: 'LOADING_FAILED'
  })
  } 

  var ingredients = myJson.meals.map(this.getIngredients);  
  var measures = myJson.meals.map(this.getMeasures);            
  this.setState({
    myRecipe: myJson.meals[0],
    image: myJson.meals[0].strMealThumb,
    loadingState: 'LOADING_DONE',
    ingredients: ingredients,
    measures: measures
  });
  console.log(this.state.myRecipe)
}

//function to toggle the like button
toggleLike= (event) =>{
  if(event.target.style.color === "black")
    event.target.style.color = "red";
  else
    event.target.style.color = "black";
}

//function to get ingredients
getIngredients = (object) => {
  var keys = Object.keys(object);
  console.log(keys);
  var ingredients = [];
  for(var i=0; i<keys.length; i++) {
    if(keys[i].indexOf("strIngredient") !== -1) {

      if((object["" + keys[i]]) != null && object["" + keys[i]].length > 0)
        ingredients.push(object["" + keys[i]]);
    }
  }
  console.log(ingredients);
  return ingredients;
}

//function to get measures
getMeasures = (object) => {
  var keys = Object.keys(object);
  console.log(keys);
  var measures = [];
  for(var i=0; i<keys.length; i++) {
    if(keys[i].indexOf("strMeasure") !== -1) {

      if((object["" + keys[i]]) !== null && object["" + keys[i]].length > 0)
        measures.push(object["" + keys[i]]);
    }
  }
  console.log(measures);
  return measures;
}

//function to print ingredients and measures
printIngredients = (value, index) => {
  console.log(this.state);
  return <p>{value} ---- {this.state.measures[0][index]}</p>
}

  render() {   
    return (
      <div id="parent">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.css"/>

    <div id="header">
          <h1 id="head">Recipe Finder</h1>
         <center><input onChange={(event)=>this.setName(event)} value={this.state.search} placeholder="Enter the Name of the Dish"/>
         <span><button onClick={this.getRecipe}>Get Recipes</button></span>
         <br/>
         <br/>
         {this.state.loadingState == null ? (<h2>Type a Dish Name to Search for it's ingredient</h2>): ("")}</center>
    </div>
         {this.state.loadingState === "LOADING_FAILED" ? (<h1>No Data Has been received</h1>): ("")}
         {this.state.loadingState==="LOADING" ? (<h1>Loading....</h1>): ("")}
         {this.state.loadingState === "LOADING_DONE"? (
    <div id="container">
      <div id="header1">
         <div></div>
         <div><h1 id="main">{this.state.myRecipe.strMeal}</h1></div>
         <div><i id="heart" className="far fa-heart" onClick={this.toggleLike}></i></div>
      </div>
      <div id="description">
        <div id="left">
         <img src={this.state.image} alt=""/>
        </div>
        <div id="right">
         <i>Category of the Meal - </i>{this.state.myRecipe.strCategory}
         <br/>
         <i>Area of the Meal - </i>{this.state.myRecipe.strArea}
         <br/>
         <br/>
         
         <i>Ingredients</i>
         <div id="ingredient">{this.state.ingredients[0].map(this.printIngredients)}</div>
         <i><center>Recipe</center></i>
         
         <div id="recipe">
         {this.state.myRecipe.strInstructions}
         </div>
        </div>
      </div>
    </div>
     ): ("")}
      </div>
    );
  }
}
export default App;