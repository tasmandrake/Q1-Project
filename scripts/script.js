$(document).ready(function() {

  listChoice();
  ingredientPairSearch();
  ingredientSelection();
  recipeSearch();
  recipeModals();

  function listChoice() {
    $('.drink').change(function() {
      const $options = $('.drinkPair').children().hide();
      const value = $(this).val();
      if (value.length) {
        $options.filter('.' + value).show();
      }
    }).trigger('change');

  }

  function ingredientPairSearch() {
    $('#drinkBtn').click(function(event) {
      event.preventDefault();
      $('#pairIngredients').html('');
      $('#ingredientsSearch').val('');
      $('#pairIngredientsSearch').addClass('hidden');
      const drink = $('.drink').val();
      const food = $('.' + drink).val();
      const id = beerFoodId[drink][food];
      $.getJSON('https://g-foodpairing.herokuapp.com/ingredients/' + id + '/pairings?order=random', data => createIngredients(data, food));
    });
  }
  function createIngredients(data, food) {
    $('#break1').html('');
    $('#break1').append('<br><br><br><br><br><br><br><br>');
    $('#pairIngredientsDiv').addClass('navBarFix');
    for (let i = 0; i < data.length; i++) {
      const $cardHead = $('<div>');
      const $ingredientCard = $('<div class="card text-center ingredientCard">');
      const $cardImage = $('<img class="card-img-top center-text">');
      const $cardImageBox = $('<div class="card-block">');

      const image = data[i]._links.ingredient._links.image.size_240;
      $cardImage.prop('src', image);

      let ingredientName = data[i]._links.ingredient.name;
      if (ingredientName.includes("'")) {
          ingredientName = ingredientName.slice(0, (ingredientName.indexOf("'") - 1));
        } else if (ingredientName.includes('(')) {
          ingredientName = ingredientName.slice(0, (ingredientName.indexOf('(') - 1));
        } else if (ingredientName.includes('®')) {
          ingredientName = ingredientName.slice(0, ingredientName.length - 1);
        }
      const $cardTitle = $('<div class="card-header">' + ingredientName + '</div>');

      $cardImageBox.append($cardImage);
      $cardHead.append($cardTitle);
      $ingredientCard.append($cardHead);
      $ingredientCard.append($cardImageBox);

      $('#pairIngredients').append($ingredientCard);
      $('#pairIngredientsSearch').removeClass('hidden');
    }
    $('#ingredientsSearch').val(food);
    location.hash = '#pairIngredientsDiv';
    $('#pairIngredientsSearch').prepend('<br><br><br>');
    $('#pairIngredientsSearch').append('<br><br><br><br>')

  }

  function ingredientSelection() {
    $('#pairIngredients').click(function(event) {
      const ingredient = $('#ingredientsSearch');
      const $twoParents = $(event.target).parent().parent();
      const $oneParents = $(event.target).parent();
      const classes1 = 'card text-center ingredientCard';
      const classes2 = 'card text-center ingredientCard card-inverse card-success';
      let choice;
      if ($twoParents.attr('class') === classes1) {
          $twoParents.toggleClass('card-inverse card-success');
          choice = $twoParents.children()[0].innerText;
        } else if ($twoParents.attr('class') === classes2) {
          $twoParents.toggleClass('card-inverse card-success');
          choice = $twoParents.children()[0].innerText;
        } else if ($oneParents.attr('class') === classes2) {
          $oneParents.toggleClass('card-inverse card-success');
          choice = $oneParents.children()[0].innerText;
        } else if ($oneParents.attr('class') === classes1) {
          $oneParents.toggleClass('card-inverse card-success');
          choice = $oneParents.children()[0].innerText;
        }
      if (ingredient.val().includes(choice.trim()) && ingredient.val().indexOf(choice.trim() !== 0)) {
          ingredient.val(ingredient.val().split(', ').filter(element => element !== choice.trim()).join(', '));
        } else if (ingredient.val()) {
          ingredient.val(ingredient.val() + ', ' + choice);
        } else {
          ingredient.val(choice);
        }
    });

  }

  function recipeSearch() {
    $('#recipeBtn').click(function(event) {
      event.preventDefault();
      $('#recipeList1').html('');
      $('#recipeList2').html('');
      $('#break3').html('');
      const search1 = $('#ingredientsSearch').val().split(', ').join('+');
      const search2 = $('#ingredientsSearch').val().split(', ').join(',');
      $.getJSON('https://g-yummly.herokuapp.com/v1/api/recipes?&q=' + search1 + '&maxResult=16', data => createRecipes1(data));
      $.getJSON('https://g-food2fork.herokuapp.com/api/search?&q=' + search2, data => createRecipes2(data));
    });
  }
  function createRecipes1(data) {
    $('#break2').html('');
    $('#break2').append('<br><br><br><br><br><br><br><br>');
    $('#recipeList1').addClass('navBarFix');

    for (let i = 0; i < data.matches.length; i++) {
      const id = data.matches[i].id;
      $.getJSON('https://g-yummly.herokuapp.com/v1/api/recipe/' + id, recipeData => recipeInfo1(recipeData));
    }
    setTimeout(function() {
      location.hash = '#recipeList1';
    }, 1000);
    $('footer').removeClass('hidden');
    $('.searchMore').removeClass('hidden');
  }
  function recipeInfo1(recipeData) {
    const $card = $('<div class="card recipeCard">');
    const image = recipeData.images[0].hostedLargeUrl;
    const $image = $('<img class="card-img-top center-text" src="' + image + '">');
    const $cardBlock = $('<div class="card-block d-flex p-2 flex-column justify-content-between">');
    const recipeName = recipeData.name;
    const $cardTitle = $('<h4 class="card-text">' + recipeName + '</h4><br>');
    const link = recipeData.source.sourceRecipeUrl;
    const $link = $('<a class="btn btn-success" href="' + link + '" target="_blank" data-toggle="modal" data-target="#recipePopUp">Go to Recipe</button>');
    //const link = recipeData.attribution.url;
    $cardBlock.append($cardTitle);
    $cardBlock.append($link);
    $card.append($image);
    $card.append($cardBlock);
    $('#recipeList1').append($card);
  }
  function createRecipes2(data) {
    $('#break3').append('<br>');
    for (let i = 0; i < data.recipes.length; i++) {
      recipeInfo2(data, i);
    }
  }
  function recipeInfo2(data, i) {
    const $card = $('<div class="card recipeCard">');
    const image = data.recipes[i].image_url;
    const $image = $('<img class="card-img-top center-text" src="' + image + '">');
    const $cardBlock = $('<div class="card-block d-flex p-2 flex-column justify-content-between">');
    const recipeName = data.recipes[i].title;
    const $cardTitle = $('<h4 class="card-text">' + recipeName + '</h4>');
    const link = data.recipes[i].f2f_url;
    // const link = data.recipes[i].source_url;
    const $link = $('<a class="btn btn-success" href="' + link + '" target="_blank" data-toggle="modal" data-target="#recipePopUp">Go to Recipe</button>');
    $cardBlock.append($cardTitle);
    $cardBlock.append($link);
    $card.append($image);
    $card.append($cardBlock);
    $('#recipeList2').append($card);
  }

  function recipeModals() {
    $('#recipeList1').click(function(event) {
      if ($(event.target).hasClass('btn btn-success')) {
        createModal(event);
      }
    });
    $('#recipeList2').click(function(event) {
      if ($(event.target).hasClass('btn btn-success')) {
        createModal(event);
        console.log('click');
      }
    });
  }
  function createModal(event) {
    const url = $(event.target).prop('href');
    $('#recipeIframe').attr('src', url);
  }

  // /"https://static.yummly.co/api-logo.png" yummly logo
  const beerFoodId = {
    crisp: {
      'Brown Rice': 4413,
      'Quinoa': 5835,
      'Basmati Rice': 4309
    },
    maltyFruity: {
      'Fava Beans': 4652,
      'Chickpeas': 3950,
      'Green Beans': 4715,
      'Clams': 4539,
      'Scallops': 5192,
      'Lobster': 4863,
      'Shrimp': 5222
    },
    sour: {
      'Beef': 3068,
      'Lamb': 4823,
      'Parsnips': 5022,
      'Carrots': 137,
      'Beets': 135
    },
    hoppyBitter: {
      'Duck': 5518,
      'Quail': 5520,
      'Chicken': 4517,
      'Brown Rice': 4413,
      'Quinoa': 5835,
      'Basmati Rice': 4309,
      'Butter': 1376,
      'Olive Oil': 1408,
      'Sausage': 3351,
      'Bacon': 4290,
      'Pork Loin': 5093
    },
    dark: {
      'Butter': 1376,
      'Olive Oil': 1408,
      'Carrots': 137,
      'Bell Peppers': 136,
      'Mushrooms': 4948,
      'Broccoli': 4411,
      'Dark Chocolate': 1518,
      'Milk Chocolate': 1544
    },
    belgian: {
      'Brie': 1910,
      'Cheddar': 1727,
      'Blue Cheese': 1751,
      'Mozzarella': 4935,
      'Goat Cheese': 4697
    },
    maltySweet: {
      'Dark Chocolate': 1518,
      'Milk Chocolate': 1544
    },
    fruitySweet: {
      'Sausage': 3351,
      'Bacon': 4290,
      'Pork Loin': 5093
    },
    sweet: {
      'Ice Cream': 191,
      'Cake': 1104
    }
  };

});
