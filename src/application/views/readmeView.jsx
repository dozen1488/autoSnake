import React from "react";
import ButtonPanel from "./buttonPanelView";

export default function renderReadme({ actions }) {
    return (
        <div className="container">
            <div>
                <p className="readme-header">
                    Змейка с примитивным AI. Распознаёт окружение вокруг себя в радиусе 1 квадрата.
                    При перезагрузке стреницы отсылает опыт на сервер.
                    Сервер переобучает сеть и возвращает новую.
                    Следовательно для обновления опыта змейки перезагрузите страницу.
                    Пока что единственный способ сбросить опыт змейки до нуля - это: <br/>
                    1) Остановить сервер <br/>
                    2) Удалить фаил "/autosnake/server/images.json" <br/>
                    3) Запустить сервер <br/>
                </p>
                <p className="readme-header"> &lt; Space &gt; - остановить змейку</p>
                <p className="readme-header"> &lt; Right Click &gt; - создать стену</p>
                <p className="readme-header"> &lt; Left Click &gt; - создать пищу</p>
                <p className="readme-header">
                    Запуск тестов: <br/>
                    1) npm run karma - проверка ренедра квадрата и доски <br/>
                    2) npm run jest - сравнение рендера примитивных компонентов со снимками
                </p>
            </div>
            {
                (actions) ? <ButtonPanel buttonArray={[
                    {
                        innerText: "Reset network experience",
                        onClickAction: () => actions.networkReady()
                    },
                    {
                        innerText: "Reset network with 2 range",
                        onClickAction: () => actions.networkReady(2)
                    }
                ]}/> : <div/>
        }
        </div>
    );
}
