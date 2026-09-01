(() => {
  const SITE_PASSWORD = "20260917";
  const guestNames = new Set([
    "沈婉婷", "陆童瑶", "邹馨玥", "塔塔", "沈健", "张丽敏",
    "不二的好朋友", "布鲁的好朋友", "颜艺辉", "唐丽娜", "爷爷",
    "姑姑", "奶奶", "Vera", "Richard",
  ]);

  const hotspot = document.createElement("button");
  hotspot.type = "button";
  hotspot.className = "invite-hotspot";
  hotspot.setAttribute("aria-label", "打开邀请函");
  hotspot.hidden = true;
  document.body.appendChild(hotspot);

  const preloader = document.querySelector(".preloader");
  if (!preloader) hotspot.hidden = false;
  else new MutationObserver(() => {
    if (!document.querySelector(".preloader")) hotspot.hidden = false;
  }).observe(document.body, { childList: true });

  const dialog = document.createElement("dialog");
  dialog.className = "invite-access-dialog";
  dialog.innerHTML = `
    <form method="dialog" class="invite-access-form" id="invite-access-form">
      <button class="invite-access-close" type="button" aria-label="关闭">×</button>
      <p class="invite-access-eyebrow">A LITTLE INVITATION</p>
      <h1>请输入你的名字和邀请码</h1>
      <label for="invite-guest-name">你的名字</label>
      <input id="invite-guest-name" name="guest" autocomplete="name" placeholder="输入中文姓名" required>
      <label for="invite-access-code">邀请码</label>
      <input id="invite-access-code" name="code" type="password" inputmode="numeric" autocomplete="current-password" placeholder="输入邀请码" required>
      <p class="invite-access-error" id="invite-access-error" role="alert"></p>
      <button class="invite-access-submit" type="submit">打开邀请函 <span aria-hidden="true">→</span></button>
    </form>
  `;
  document.body.appendChild(dialog);

  const guestName = dialog.querySelector("#invite-guest-name");
  const accessCode = dialog.querySelector("#invite-access-code");
  const error = dialog.querySelector("#invite-access-error");
  const closeButton = dialog.querySelector(".invite-access-close");

  function openDialog() {
    if (!dialog.open) dialog.showModal();
    guestName.focus();
  }

  function openGuestPage(name) {
    const guestUrl = `/0917/guest/#guest=${encodeURIComponent(name)}`;
    window.location.assign(guestUrl);
  }

  hotspot.addEventListener("click", openDialog);
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", () => { error.textContent = ""; });
  dialog.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = guestName.value.trim();
    if (accessCode.value !== SITE_PASSWORD) {
      error.textContent = "邀请码不正确，请核对后重试。";
      return;
    }
    if (!guestNames.has(name)) {
      error.textContent = "暂时没有找到这个姓名，请确认中文名。";
      return;
    }
    sessionStorage.setItem("0917-invite-access", "granted");
    openGuestPage(name);
  });
})();
