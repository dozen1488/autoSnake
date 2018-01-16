import { Text } from "react-native";
import React, { PureComponent } from "react";

export default class RenderReadme extends PureComponent {
    render() {
        return (
            <Text>
                <Text>
                    Змейка с примитивным AI. Распознаёт окружение вокруг себя в радиусе 1 квадрата.
                    При перезагрузке стреницы отсылает опыт на сервер.
                    Сервер переобучает сеть и возвращает новую.
                    Следовательно для обновления опыта змейки перезагрузите страницу.
                    Пока что единственный способ сбросить опыт змейки до нуля - это:
                    1) Остановить сервер 
                    2) Удалить фаил "/autosnake/server/images.json"
                    3) Запустить сервер 
                </Text>
                <Text> &lt; Space &gt; - остановить змейку</Text>
                <Text> &lt; Right Click &gt; - создать стену</Text>
                <Text> &lt; Left Click &gt; - создать пищу</Text>
                <Text>
                    Запуск тестов:
                    1) npm run karma - проверка ренедра квадрата и доски 
                    2) npm run jest - сравнение рендера примитивных компонентов со снимками
                </Text>
            </Text>
        );
    }
}
