const monster = {
  maxHealth: 10,
  name: "Лютый",
  moves: [
      {
          "name": "Удар когтистой лапой",
          "physicalDmg": 3,           // физический урон
          "magicDmg": 0,              // магический урон
          "physicArmorPercents": 20,  // физическая броня
          "magicArmorPercents": 20,   // магическая броня
          "cooldown": 0               // ходов на восстановление
      },
      {
          "name": "Огненное дыхание",
          "physicalDmg": 0,
          "magicDmg": 4,
          "physicArmorPercents": 0,
          "magicArmorPercents": 0,
          "cooldown": 3
      },
      {
          "name": "Удар хвостом",
          "physicalDmg": 2,
          "magicDmg": 0,
          "physicArmorPercents": 50,
          "magicArmorPercents": 0,
          "cooldown": 2
      },
  ]
}

const hero = {
  name: "Боевой маг Евстафий",
  moves: [
    {
        "name": "Удар боевым кадилом",
        "physicalDmg": 2,
        "magicDmg": 0,
        "physicArmorPercents": 0,
        "magicArmorPercents": 50,
        "cooldown": 0
    },
    {
        "name": "Вертушка левой пяткой",
        "physicalDmg": 4,
        "magicDmg": 0,
        "physicArmorPercents": 0,
        "magicArmorPercents": 0,
        "cooldown": 4
    },
    {
        "name": "Каноничный фаербол",
        "physicalDmg": 0,
        "magicDmg": 5,
        "physicArmorPercents": 0,
        "magicArmorPercents": 0,
        "cooldown": 3
    },
    {
        "name": "Магический блок",
        "physicalDmg": 0,
        "magicDmg": 0,
        "physicArmorPercents": 100,
        "magicArmorPercents": 100,
        "cooldown": 4
    },
  ]
}



function getDifficulty() {

  document.getElementById("input").value = "";

  hero.health = prompt("Выберите сложность (здоровье)");

  if (hero.health === null) {
    alert("Отмена игры.");

    document.getElementById("input").style.display = "none";
    document.getElementById("submit").style.display = "none";

    return undefined;
  }

  if (isNaN(Number(hero.health)) || hero.health <= 0) {
    alert("Введено некорректное значение. Здоровье приравнивается дефолтному значению - 10.");
    hero.health = 10;
  }

}

document.body.onload = getDifficulty;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

let str = "";

document.getElementById("submit").onclick = function () {

  str = document.getElementById("input").value.toLowerCase();

  play();

  document.getElementById("input").value = "";

}

function getHeroMove() {

  if (str == "Удар боевым кадилом".toLocaleLowerCase()) {
    str = '0';
  }
  else if (str == "Вертушка левой пяткой".toLocaleLowerCase()) {
    str = '1';
  }
  else if (str == "Каноничный фаербол".toLowerCase()) {
    str = '2';
  }
  else if (str == "Магический блок".toLowerCase()) {
    str = '3';
  }

  if (Number(str) > 3 || Number(str) < 0 || isNaN(Number(str))) {
    str = undefined;
    alert("Действие недоступно");
    document.getElementById("input").value = "";
  }

  return Number(str);

}

// Вычисление здоровья после хода
function dealDamage(heroMove, monsterMove) {

  monster.maxHealth -= (hero.moves[heroMove]["physicalDmg"] * (1-monster.moves[monsterMove]["physicArmorPercents"]/100))
                    + hero.moves[heroMove]["magicDmg"] * (1-monster.moves[monsterMove]["magicArmorPercents"]/100);

  hero.health -= (monster.moves[monsterMove]["physicalDmg"] * (1-hero.moves[heroMove]["physicArmorPercents"]/100))
              + monster.moves[monsterMove]["magicDmg"] * (1-hero.moves[heroMove]["magicArmorPercents"]/100);

}

// Свойство "step" будет хранить номер шага, на котором был сделан скил
for (let i = 0; i < monster.moves.length; i++) {
  monster.moves[i]["step"] = 0;
}
for (let i = 0; i < hero.moves.length; i++) {
  hero.moves[i]["step"] = 0;
}

let counter = 1;                                    // Номер хода

function play() {

  let monsterMove = getRandomInt(0, 3);             // Получение хода монстра
  while (counter - monster.moves[monsterMove]["step"] < monster.moves[monsterMove]["cooldown"]) {
    monsterMove = getRandomInt(0, 3);
  }

  let heroMove = getHeroMove();                     // Ход героя
  if (hero.moves[heroMove]["step"] > 0 && counter - hero.moves[heroMove]["step"] < hero.moves[heroMove]["cooldown"]) {
    alert("Способность перезаряжается!");
    return undefined;
  }

  dealDamage(heroMove, monsterMove);                // Нанесение урона

  console.log(counter - hero.moves[heroMove]["step"]);

  monster.moves[monsterMove]["step"] = counter;     // Запоминаем ход
  hero.moves[heroMove]["step"] = counter;

  counter++;                                        // Увеличиваем номер хода

  // ===================================================================================
  // Информационные сообщения
  let pH        = document.createElement("p");
  let pM        = document.createElement("p");
  let healthMes = document.createElement("p");

  pH.innerHTML        = `Действие игрока: ${hero.moves[heroMove]["name"]}`;
  pM.innerHTML        = `Действие монстра: ${monster.moves[monsterMove]["name"]}`;
  healthMes.innerHTML = `Здоровье героя: ${hero.health}, монстра: ${monster.maxHealth}`;

  document.body.appendChild(pH);
  document.body.appendChild(pM);
  document.body.appendChild(healthMes);
  // ===================================================================================

  // Конец игры
  if (hero.health <= 0 && monster.max <= 0) {
    alert("Оба погибли!");
    document.getElementById("input").style.display = "none";
    document.getElementById("submit").style.display = "none";
    return 1;
  }
  else if (hero.health <= 0) {
    alert("Победил Лютый!");
    document.getElementById("input").style.display = "none";
    document.getElementById("submit").style.display = "none";
    return 1;
  }
  else if (monster.maxHealth <= 0) {
    alert("Победил Евстафий!");
    document.getElementById("input").style.display = "none";
    document.getElementById("submit").style.display = "none";
    return 1;
  }

}