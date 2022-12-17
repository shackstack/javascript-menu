const MissionUtils = require("@woowacourse/mission-utils");
const Random = MissionUtils.Random;

const { MENU_LIST } = require("../constant/MenuList");

class Menu {
  #categories = [];
  #uneatableMenus = [];
  #coachData = new Object();

  getRecommandedCategories() {
    return this.#categories;
  }

  validate(menus) {
    const uneatableMenus = menus.split(",");

    this.isValidQuantity(uneatableMenus);

    this.#uneatableMenus.push(uneatableMenus);
  }
  isValidQuantity(uneatableMenus) {
    if (!(uneatableMenus.length >= 0 && uneatableMenus.length <= 2)) {
      throw new Error("[ERROR] 못 먹는 메뉴는 최소 0개, 최대 2개이어야 합니다");
    }
  }

  makeRecommandResult() {
    this.recommandCategories();
  }

  recommandCategories() {
    const pickedCategory =
      MENU_LIST.category[Random.pickNumberInRange(1, 5) - 1];

    if (this.checkAvailable(pickedCategory) === false) {
      return this.recommandCategories();
    }

    this.#categories.push(pickedCategory);

    if (this.#categories.length !== 5) {
      return this.recommandCategories();
    }
  }

  checkAvailable(pickedCategory) {
    let count = 0;
    this.#categories.forEach((item) => {
      if (item === pickedCategory) {
        count += 1;
      }
    });
    if (count >= 2) {
      return false;
    }
    return true;
  }

  getCoachData() {
    return this.#coachData;
  }

  recommandCoachesMenu(coaches) {
    coaches.forEach((coach, index) => {
      this.#coachData[coach] = this.getValidMenu(index);
    });
  }

  getValidMenu(index) {
    let onesDiet = [];
    const onesUneatableMenu = this.#uneatableMenus[index];

    this.#categories.forEach((cate) => {
      const menu = this.getMenuPerADay(cate, onesUneatableMenu);
      onesDiet.push(menu);
    });

    return onesDiet;
  }

  getMenuPerADay(cate, onesUneatableMenu) {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let list = MENU_LIST[cate].split(", ");
    const menu = list[Random.shuffle(arr)[0] - 1];
    if (menu === onesUneatableMenu) {
      return this.getMenuPerADay(cate, onesUneatableMenu);
    }
    return menu;
  }
}

const menu = new Menu();
menu.makeRecommandResult();

module.exports = Menu;
