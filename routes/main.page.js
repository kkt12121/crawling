const express = require('express')
const { Builder, By, Key, until } = require('selenium-webdriver');
// const chrome = require('selenium-webdriver/chrome');
// const axios = require("axios");
// const cheerio = require("cheerio");
// const PDFJS = require('pdfjs-dist');
const http = require('http');
const fs = require('fs');
const readLine = require('readline');
const router = express.Router()
const models = require("../models");
const { ai_db } = require('../models/index');

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const keywordsArr = [
    "손해배상", "손실보상", "대여금", "부당이득반환", "매매", "매매대금", "사해행위취소", "임대차", "부동산",
    "채무부존재", "계약", "주주총회", "지급명령", "회사분쟁", "소유권이전등기", "건물명도",
    "임대차보증금반환", "하자", "재건축", "재개발", "공유물분할청구", "채무불이행", "가압류",
    "가처분", "이혼", "상속", "가사", "증여", "상간자", "노동", "퇴직금", "교통사고", "회생", "파산", "특허", "저작권",
    "상표", "지식재산", "실용신안", "보험계약", "화해", "소액심판", "공시최고", "재권판결", "이행권고", "이자제한", "저당",
    "근저당", "광업", "수산", "하천", "교량", "유실물", "공탁", "호적", "부동산등기", "점유", "유치", "질권",
    "체포", "구속", "영장실질심사", "구속적부심", "살인", "강도", "폭행", "납치", "상해", "특수폭행", "집단폭행", "강금",
    "유괴", "사기", "횡령", "배임", "절도", "협박", "모욕", "방화", "공갈", "손괴", "유사수신", "보이스피싱", "스미싱",
    "강제집행면탈", "강간", "성폭행", "성추행", "강제추행", "성희롱", "공연음란", "도촬", "음란행위", "음란물제작", "사이버범죄",
    "도박", "마약수출입", "마약제조", "마약투약", "마약매매", "마약소지", "향정신성의약품", "뺑소니", "난폭운전", "보복운전",
    "음주운전", "무면허운전", "학교폭력", "집단폭력", "아동복지법위반", "정서적학대", "신체적학대", "보험금사기", "주가조작", "신용카드범죄",
    "불법투자금융", "부실대출", "외환법죄", "뇌물", "배임수증재", "청탁금지", "김영란법",
];

router.get("/caseSummary", async (req, res) => {
  const data = ai_db.openAPI_case.findAll({
    where: { summary: null },
  });

  return res.status(200).json(data);
});

router.get("/inspection", async (req, res) => {
    const { page, pageSize } = req.query;
    let startPage = 0;
    let result = new Object();
    let list = [];    

    if (!pageSize) throw new BadRequest("emptyData");

    if (page) {
      startPage = (page - 1) * parseInt(pageSize);
    }

    const data = await models.openapi_casenotes.findAll({
        attributes: ["id", "type", "summary"],
        order: [["id", "DESC"]]
    })

    for (let i = startPage; startPage + parseInt(pageSize) > i; i++) {
        if (data[i]) {
          list.push(data[i]);
        } else {
          break;
        }
      }
  
      result.page = Math.ceil(data.length / parseInt(pageSize));
      result.list = list;
  
      return res.status(200).json({ status: "S02", result });
})

router.post('/', async (req, res, next) => {
    const { type } = req.body;
    let data
    try {
        if (type == 'lng') {
            data = await LnG()
        } else if (type == 'talk') {
            data = await LT()
        } else if (type == 'open1') {
            data = await openAPI_5259()
        } else if (type == 'open2') {
            data = await openAPI_85545()
        } else if (type == "caseNote") {
            data = await caseNote()
        }
        res.render('index', {
            result: data
        })
    } catch (error) {
        console.log(error)
    }
})

router.get('/inflearn', async (req, res, next) => {
    try {
        let driver = await new Builder().forBrowser('chrome').build();

        for (let i = 1; i <= 23; i++) {
            await driver.get(`https://www.inflearn.com/community/projects?page=${i}&order=recent`);
            await driver.wait(until.elementLocated(By.css("#main > section.community-body > div.community-body__content > div.question-list-container > ul")), 10000).catch((error) => { });

            let table = await driver.findElement(By.css("#main > section.community-body > div.community-body__content > div.question-list-container > ul"));
            let li = await table.findElements(By.css("li"));
            for (let j = 0; j < li.length; j++) {
                let updateDate
                let createDate
                let views

                table = await driver.findElement(By.css("#main > section.community-body > div.community-body__content > div.question-list-container > ul"));
                li = await table.findElements(By.tagName("li"))
                let link = await li[j].findElement(By.tagName("a"))
                let href = await link.getAttribute("href")

                await driver.get(href)
                await driver.wait(until.elementLocated(By.css("#main")), 10000).catch(async (error) => { })

                let section = await driver.findElements(By.css("section"))
                let title = await section[0].findElement(By.xpath("/html/body/div[1]/main/section[1]/div[2]/div/div[1]/div[1]")).getText()
                let writer = await section[0].findElement(By.xpath("/html/body/div[1]/main/section[1]/div[2]/div/div[1]/div[2]/div/h6")).getText()
                let side = await section[0].findElements(By.xpath("/html/body/div[1]/main/section[1]/div[2]/div/div[1]/div[2]/div/div/span"));
                if (side.length == 2) {
                    updateDate = null
                    createDate = await section[0].findElement(By.xpath("/html/body/div[1]/main/section[1]/div[2]/div/div[1]/div[2]/div/div/span[1]/span[2]")).getText()
                    views = await section[0].findElement(By.xpath("/html/body/div[1]/main/section[1]/div[2]/div/div[1]/div[2]/div/div/span[2]/span[2]")).getText()
                } else {
                    updateDate = await section[0].findElement(By.xpath("/html/body/div[1]/main/section[1]/div[2]/div/div[1]/div[2]/div/div/span[2]/span[2]")).getText()
                    createDate = await section[0].findElement(By.xpath("/html/body/div[1]/main/section[1]/div[2]/div/div[1]/div[2]/div/div/span[1]/span[2]")).getText()
                    views = await section[0].findElement(By.xpath("/html/body/div[1]/main/section[1]/div[2]/div/div[1]/div[2]/div/div/span[3]/span[2]")).getText()
                }
                let contents = await section[0].findElement(By.xpath("/html/body/div[1]/main/section[1]/div[2]/div/div[2]/div[1]")).getText()

                console.log("data:", `${title} ${writer} ${updateDate} ${createDate} ${views}`)

                await models.inflearn.create({
                    title,
                    writer,
                    updateDate,
                    createDate,
                    views,
                    contents
                });

                await driver.get(`https://www.inflearn.com/community/projects?page=${i}&order=recent`);
                await driver.wait(until.elementLocated(By.css("#main > section.community-body > div.community-body__content > div.question-list-container > ul")), 10000).catch((error) => { });
            }
        }

        return res.status(200).json("ok")
    } catch (error) {
        console.log(error)
    }
})

router.get("/caseNote_caseLaw", async (req, res, next) => {
    try {
        let table, table2, table3, table4, table5, div, link, href;
        let driver = await new Builder().forBrowser("chrome").build();

        await driver.get("https://casenote.kr/");
        await driver.wait(until.elementsLocated(By.css("body")), 10000).catch((error) => { });

        table = await driver.findElement(By.css("body"));
        table2 = await table.findElement(By.className("cn-container"));
        table3 = await table2.findElement(By.className("cn-page-header"));
        table4 = await table3.findElement(By.className("cn-page-header-top"));
        table5 = await table4.findElement(By.className("menu"));
        let li = await table5.findElements(By.css("li"));
        link = await li[3].findElement(By.tagName("a"));
        href = await link.getAttribute("href");

        await driver.get(href);
        await driver.wait(until.elementLocated(By.css("body")), 10000).catch(async (error) => { });

        let loginDiv = await driver.findElement(By.css("body"));
        let loginDiv2 = await loginDiv.findElement(By.className("form-container"));
        let loginDiv3 = await loginDiv2.findElement(By.className("form-area"));
        let loginDiv4 = await loginDiv3.findElement(By.tagName("form"));
        let loginIdInput = await loginDiv4.findElement(By.name("username"));
        let loginPwInput = await loginDiv4.findElement(By.name("password"));

        await loginIdInput.sendKeys(caseNoteID);
        await loginPwInput.sendKeys(caseNotePW, Key.RETURN);

        await driver.wait(until.urlIs('https://casenote.kr/'), 10000);

        for (let keyword of keywords) {
            for (let i = 1; i <= 20; i++) {
                await driver.get(`https://casenote.kr/search/?q=${keyword}&sort=0&period=0&partial=0&oc=0&page=${i}`);
                await driver.wait(until.elementsLocated(By.css("body")), 10000).catch((error) => { });

                table = await driver.findElement(By.css("body"));
                table2 = await table.findElement(By.css("body > div.cn-search-list"));
                table3 = await table2.findElement(By.className("cn-search-contents"));
                div = await table3.findElements(By.className("searched-item"));
                for (let j = 0; j < div.length; j++) {
                    let title;
                    let content;
                    await delay(500);

                    table = await driver.findElement(By.css("body"));
                    table2 = await table.findElement(By.css("body > div.cn-search-list"));
                    table3 = await table2.findElement(By.className("cn-search-contents"));
                    div = await table3.findElements(By.className("searched-item"));
                    let link = await div[j].findElement(By.tagName("a"))
                    let href = await link.getAttribute("href");

                    await driver.get(href);
                    await driver.wait(until.elementLocated(By.css("body")), 10000).catch(async (error) => { });
                    await delay(500);

                    let hrefDiv = await driver.findElement(By.css("body"));
                    let hrefDiv2 = await hrefDiv.findElement(By.className("cn-case-container"));
                    let hrefDiv3 = await hrefDiv2.findElement(By.css("#cn-case-left-container"));
                    let hrefDiv4 = await hrefDiv3.findElement(By.className("cn-case"));
                    let hrefDiv5 = await hrefDiv4.findElement(By.className("cn-case-contents"));
                    let hrefDiv6 = await hrefDiv5.findElement(By.className("cn-case-left"));

                    title = await hrefDiv6.findElement(By.className("cn-case-title")).getText();
                    content = await hrefDiv6.findElement(By.className("cn-case-body")).getText();

                    await models.openAPI_caseNote.create({
                        type: keyword,
                        title,
                        content
                    })

                    await driver.get(`https://casenote.kr/search/?q=${keyword}&sort=0&period=0&partial=0&oc=0&page=${i}`);
                    await driver.wait(until.elementLocated(By.css("body")), 10000).catch((error) => { });
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
})

router.get("/caseNote_decision", async (req, res, next) => {
    try {
        let table, table2, table3, div;
        let driver = await new Builder().forBrowser("chrome").build();

        for (let keyword of keywords) {
            try {
                for (let i = 1; i <= 20; i++) {
                    await driver.get(`https://casenote.kr/search_gov/?q=${keyword}&sort=0&period=0&page=${i}`);
                    await driver.wait(until.elementsLocated(By.css("body")), 10000).catch((error) => { });

                    table = await driver.findElement(By.css("body"));
                    table2 = await table.findElement(By.css("body > div.cn-search-list"));
                    table3 = await table2.findElement(By.className("cn-search-contents"));
                    div = await table3.findElements(By.className("searched-item"));
                    for (let j = 0; j < div.length; j++) {
                        let title;
                        let content;
                        await delay(500);

                        table = await driver.findElement(By.css("body"));
                        table2 = await table.findElement(By.css("body > div.cn-search-list"));
                        table3 = await table2.findElement(By.className("cn-search-contents"));
                        div = await table3.findElements(By.className("searched-item"));
                        let link = await div[j].findElement(By.tagName("a"))
                        let href = await link.getAttribute("href");

                        await driver.get(href);
                        await driver.wait(until.elementLocated(By.css("body")), 10000).catch(async (error) => { });
                        await delay(500);

                        let hrefDiv = await driver.findElement(By.css("body"));
                        let hrefDiv2 = await hrefDiv.findElement(By.className("cn-case-container"));
                        let hrefDiv3 = await hrefDiv2.findElement(By.css("#cn-case-left-container"));
                        let hrefDiv4 = await hrefDiv3.findElement(By.className("cn-case"));
                        let hrefDiv5 = await hrefDiv4.findElement(By.className("cn-case-contents"));
                        let hrefDiv6 = await hrefDiv5.findElement(By.className("cn-case-left"));

                        title = await hrefDiv6.findElement(By.className("cn-case-title")).getText();
                        content = await hrefDiv6.findElement(By.className("cn-case-body")).getText();

                        const duplicateData = await models.caseNote_decision.findOne({
                            where: { type: keyword, title }
                        });

                        if (!duplicateData) {
                            await models.caseNote_decision.create({
                                type: keyword,
                                title,
                                content
                            })
                        }

                        await driver.get(`https://casenote.kr/search_gov/?q=${keyword}&sort=0&period=0&page=${i}`);
                        await driver.wait(until.elementLocated(By.css("body")), 10000).catch((error) => { });
                    }
                }
            } catch (error) {
                console.log("에러발생ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ");
                continue;
            }
        }
    } catch (error) {
        console.log(error)
    }
})

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) { }
    // /* title */
    // let title;
    // // let titlePattern = /제(\d+)장/ || /제(\d+)절/ || /제(\d+)관/ || /제(\d+)편/;
    // let titlePattern = /제(\d+)장/;
    // let titleContent = elementText.match(titlePattern);

    // if (titleContent == undefined) {
    //     title = elementText.replace(titlePattern, "").trim();
    // }

    // /* type */
    // let type;
    // let content;
    // let typePattern = /제(\d+)조/;
    // let typeContent = elementText.match(typePattern)
    // if (typeContent != undefined) {
    //     type = typeContent[0];
    //     content = elementText.replace(typePattern, "").trim();
    // }

    // /* content */
    // let content2
}

const openAPI_85545 = async () => { //판례 건수
    let result = []
    let driver = await new Builder().forBrowser('chrome').build();

    for (let i = 1; i <= 1; i++) { //페이지
        await driver.get(`https://www.law.go.kr/DRF/lawSearch.do?target=prec&OC=kdu1972&type=HTML&page=${i}`);
        await driver.wait(until.elementLocated(By.css("body > form > div > table > tbody")), 10000).catch((error) => { })

        let table = await driver.findElement(By.css("body > form > div > table > tbody"));
        let tr = await table.findElements(By.tagName("tr"))
        for (let r = 0; r < tr.length; r++) {
            table = await driver.findElement(By.css("body > form > div > table > tbody"));
            tr = await table.findElements(By.tagName("tr"))
            let td = await tr[r].findElements(By.tagName("td"))
            let list = new Object()
            if (td.length < 6) { break }
            for (let d = 0; d < td.length; d++) {
                list[d] = await td[d].getText()
            }
            let link = await td[1].findElement(By.tagName("a"))
            let href = await link.getAttribute("href")
            await driver.get(href)
            await driver.wait(until.elementLocated(By.css("body > table > tbody > tr > td > iframe")), 10000).catch(async (error) => { })
            await driver.switchTo().frame(0);
            await driver.wait(until.elementLocated(By.css("#contentBody")), 10000).catch((error) => { })
            let content = await driver.findElement(By.css("#contentBody")).getText()
            let summaryCheck = await driver.findElement(By.css("#yo")).getText()
            let summary = null
            if (summaryCheck == '【판결요지】') {
                summary = await driver.findElement(By.css("#conScroll > p:nth-child(4)")).getText()
            }
            await models.openAPI_case.create({
                title: list[1],         // 제목
                court: list[2],         // 법원
                type: list[3],          // 사건유형
                judgment: list[4],      // 판결유형
                date: list[5],          // 선고일자
                summary,                // 판결요지
                content,                // 내용전문
            });
            result.push(list)
            await driver.get(`https://www.law.go.kr/DRF/lawSearch.do?target=prec&OC=kdu1972&type=HTML&page=${i}`);
            await driver.wait(until.elementLocated(By.css("body > form > div > table > tbody")), 10000).catch((error) => { })
        }
    }
    return result
}

const openAPI_5259 = async () => { //법령 건수
    let result = []
    let driver = await new Builder().forBrowser('chrome').build();

    for (let i = 1; i <= 263; i++) { //페이지
        await driver.get(`https://www.law.go.kr/DRF/lawSearch.do?target=law&OC=kdu1972&type=HTML&page=${i}`);
        await driver.wait(until.elementLocated(By.css("#lawSearchForm > div > table > tbody")), 10000).catch((error) => { })

        let table = await driver.findElement(By.css("#lawSearchForm > div > table > tbody"));
        let tr = await table.findElements(By.tagName("tr"))
        for (let r = 0; r < tr.length; r++) {
            table = await driver.findElement(By.css("#lawSearchForm > div > table > tbody"));
            tr = await table.findElements(By.tagName("tr"))
            let td = await tr[r].findElements(By.tagName("td"))
            let list = new Object()
            if (td.length < 8) { break }
            for (let d = 0; d < td.length; d++) {
                list[d] = await td[d].getText()
            }
            let link = await td[1].findElement(By.tagName("a"))
            let href = await link.getAttribute("href")
            await driver.get(href)
            //sleep(3000)
            await driver.wait(until.elementLocated(By.css("#lawService")), 10000).catch(async (error) => { })
            await driver.switchTo().frame(0);
            await driver.wait(until.elementLocated(By.css("#contentBody")), 10000).catch((error) => { })
            let content = await driver.findElement(By.css("#contentBody")).getText()
            let content_str = content.substr(21)

            await models.openAPI_raw.create({
                title: list[1],         // 법령명
                department: list[2],    // 소관부처
                type: list[3],          // 제개정구분
                category: list[4],      // 법령종류
                index: list[5],         // 공포번호
                date: list[6],          // 공포일자
                start: list[7],         // 시행일
                content: content_str,   // 내용전문
            });
            result.push(list)
            await driver.get(`https://www.law.go.kr/DRF/lawSearch.do?target=law&OC=kdu1972&type=HTML&page=${i}`);
            await driver.wait(until.elementLocated(By.css("#lawSearchForm > div > table > tbody")), 10000).catch((error) => { })
        }
    }
    return result
}

const LT = async () => {
    let result = []
    let driver = await new Builder().forBrowser('chrome').build();

    for (let i = 201; i <= 300; i++) {
        await driver.get(`https://www.lawtalk.co.kr/cases?pg=${i}`);
        await driver.wait(until.elementLocated(By.className("case-card-wrap")), 5000).catch((error) => {
            driver.navigate().refresh()
        })

        let listElements = await driver.findElements(By.className("case-card-wrap"));

        for (let j = 0; j < listElements.length; j++) {
            let list = new Object()
            listElements = await driver.findElements(By.className("case-card-wrap"));
            await listElements[j].click()
            await driver.wait(until.elementLocated(By.className("recommend-question-keyword")), 5000).catch((error) => {
                driver.navigate().refresh()
            })

            let type = await driver.findElement(By.className("question-keywords")).getText()
            let title = await driver.findElement(By.className("question-title daum-wm-title")).getText()
            let content = await driver.findElement(By.className("question-body daum-wm-content")).getText()
            list.type = type
            list.title = title
            list.content = content
            result.push(list)

            await driver.get(`https://www.lawtalk.co.kr/cases?pg=${i}`);
            await driver.wait(until.elementLocated(By.className("case-card-wrap")), 3000).catch((error) => {
                driver.navigate().refresh()
            })
        }
    }
    return result
}

const LnG = async () => {
    let result = []
    let driver = await new Builder().forBrowser('chrome').build();

    for (let i = 1; i <= 100; i++) {
        await driver.get(`https://www.lawandgood.com/posts/quotation-content/list?page=${i}`);
        await driver.wait(until.elementLocated(By.className("style_quotation-content-list__j4kg2")), 3000).catch((error) => { })

        let listElements = await driver.findElements(By.className("css-oux9bc"));
        for (let j = 0; j < listElements.length; j++) {
            let list = new Object()
            listElements = await driver.findElements(By.className("css-oux9bc"));
            await listElements[j].click()
            await driver.wait(until.elementLocated(By.className("css-rtv1pn")), 3000).catch((error) => { })

            let type = await driver.findElement(By.css("#__next > div.css-iw62jn > div.css-1x8z77 > div > div.css-iw62jn > div.style_quotation-question__jeY7N.css-v4k0sz > header > a > h2 > p:nth-child(9)")).getText()
            let title = await driver.findElement(By.className("css-1k2rabt")).getText()
            let content = await driver.findElement(By.className("css-rtv1pn")).getText()

            list.type = type
            list.title = title
            list.content = content
            result.push(list)

            await driver.get(`https://www.lawandgood.com/posts/quotation-content/list?page=${i}`);
            await driver.wait(until.elementLocated(By.css("#__next > div.style_quotation-content-list-page__x2KyB > div:nth-child(2) > ul")), 5000).catch((error) => { })
        }
    }
    return result
}

module.exports = router