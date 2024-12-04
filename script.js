const form = document.getElementById("guestbookForm");
const commentsSection = document.getElementById("commentsSection");
const COMMENTS_FILE = "comments.json";

// 提交留言
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;

  // 創建留言物件
  const newComment = { name, message, date: new Date().toISOString() };

  try {
    // 使用 GitHub API 更新 JSON 文件
    const response = await fetch(
      `https://api.github.com/repos/40623226/guestbook-data/contents/${COMMENTS_FILE}`,
      {
        method: "GET",
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": `token YOUR_PERSONAL_ACCESS_TOKEN`, // 請替換為你的 GitHub Token
        },
      }
    );

    const data = await response.json();
    const content = JSON.parse(atob(data.content)); // 讀取現有留言
    content.push(newComment);

    await fetch(
      `https://api.github.com/repos/40623226/guestbook-data/contents/${COMMENTS_FILE}`,
      {
        method: "PUT",
        headers: {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": `token YOUR_PERSONAL_ACCESS_TOKEN`,
        },
        body: JSON.stringify({
          message: "Update comments",
          content: btoa(JSON.stringify(content, null, 2)), // Base64 encode JSON
          sha: data.sha,
        }),
      }
    );

    alert("Comment submitted successfully!");
    form.reset();
    loadComments(); // 重新加載留言
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to submit your comment.");
  }
});

// 加載留言
async function loadComments() {
  try {
    const response = await fetch(`./${COMMENTS_FILE}`);
    const comments = await response.json();

    commentsSection.innerHTML = "<h2>Guestbook Entries</h2>";
    comments.forEach(comment => {
      const entry = document.createElement("div");
      entry.innerHTML = `<p><strong>${comment.name}</strong> (${new Date(comment.date).toLocaleString()}): ${comment.message}</p>`;
      commentsSection.appendChild(entry);
    });
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}

// 初始化加載
loadComments();
