const net = require("net"); // Модуль для работы с сокетами
const express = require("express"); // Фреймворк для создания веб-сервера
const path = require("path"); // Модуль для работы с путями файловой системы


const app = express(); // Создаем экземпляр приложения Express


// Настройка статической папки для отдачи файлов (например, HTML, CSS, JS)
app.use(express.static("public"));


// Позволяем парсить данные, переданные через формы
app.use(express.urlencoded({ extended: true }));


// Главная страница с формой
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Отправляем HTML файл на клиент
});


// Обработка отправки данных на печать
app.post("/send", async (req, res) => {
  const printerIP = req.body.printer_ip; // Получаем IP-адрес принтера из формы
  const printData = req.body.print_data; // Получаем данные для печати из формы

  // Проверяем, что введены IP-адрес принтера и данные для печати
  if (!printerIP || !printData) {
    return res.send(
      '<p style="color: red;">Invalid printer IP or empty print data.</p>'
    );
  }

  try {
    // Создаем сокет для соединения с принтером
    const client = new net.Socket();

    // Устанавливаем соединение с принтером (порт 9100 используется для печати)
    client.connect(9100, printerIP, () => {
      client.write(printData); // Отправляем данные на печать
      client.end(); // Закрываем соединение после отправки
      res.send('<p style="color: green;">Print command sent successfully.</p>'); // Уведомляем пользователя об успешной отправке
    });

    // Обработка ошибок соединения
    client.on("error", (err) => {
      console.error("Connection error:", err.message); // Логируем ошибку на сервере
      res.send(
        `<p style="color: red;">Unable to connect to printer: ${err.message}</p>`
      ); // Возвращаем ошибку на клиент
    });
  } catch (error) {
    console.error("Error:", error.message); // Логируем общие ошибки
    res.send(`<p style="color: red;">Error: ${error.message}</p>`); // Возвращаем ошибку на клиент
  }
});


// Запуск веб-сервера на порту 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`); // Уведомляем в консоли, что сервер запущен
});
