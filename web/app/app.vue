<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto space-y-8">

      <h1 class="text-2xl font-bold text-gray-800">📚 新書監控系統</h1>

      <!-- 關鍵字管理 -->
      <section class="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">關鍵字管理</h2>
        <div class="flex gap-2">
          <input
            v-model="newKeyword"
            type="text"
            placeholder="輸入關鍵字"
            class="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            @keyup.enter="addKeyword"
          />
          <button
            @click="addKeyword"
            class="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
          >
            新增
          </button>
        </div>
        <ul class="space-y-2">
          <li
            v-for="keyword in keywords"
            :key="keyword"
            class="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg text-sm"
          >
            <span>{{ keyword }}</span>
            <button
              @click="deleteKeyword(keyword)"
              class="text-red-400 hover:text-red-600"
            >
              刪除
            </button>
          </li>
        </ul>
      </section>

      <!-- 手動掃描 -->
      <section class="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">手動掃描</h2>
        <button
          @click="scan"
          :disabled="scanning"
          class="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-sm px-6 py-2 rounded-lg"
        >
          {{ scanning ? '掃描中...' : '立即掃描' }}
        </button>
        <pre v-if="scanOutput" class="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">{{ scanOutput }}</pre>
      </section>

      <!-- 已發現書籍 -->
      <section class="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 class="text-lg font-semibold text-gray-700">已發現書籍</h2>
        <ul class="space-y-3">
          <li
            v-for="book in books"
            :key="book.key"
            class="border border-gray-100 rounded-lg p-4 text-sm space-y-1"
          >
            <div class="font-medium text-gray-800">{{ book.title }}</div>
            <div>
              <NuxtLink
                :to="book.url"
                target="_blank"
                class="text-blue-500 hover:underline break-all"
              >
                {{ book.url }}
              </NuxtLink>
            </div>
            <div class="text-gray-400 text-xs">
              {{ new Date(book.created_at).toLocaleString('zh-TW') }}
            </div>
          </li>
        </ul>
      </section>

    </div>
  </div>
</template>

<script setup>
const newKeyword = ref('');
const scanning = ref(false);
const scanOutput = ref('');

const { data: keywords, refresh: refreshKeywords } = await useFetch('/api/keywords');
const { data: books, refresh: refreshBooks } = await useFetch('/api/books');

async function addKeyword() {
  if (!newKeyword.value.trim()) return;
  await $fetch('/api/keywords', {
    method: 'POST',
    body: { keyword: newKeyword.value.trim() },
  });
  newKeyword.value = '';
  await refreshKeywords();
}

async function deleteKeyword(keyword) {
  await $fetch('/api/keywords', {
    method: 'DELETE',
    body: { keyword },
  });
  await refreshKeywords();
}

async function scan() {
  scanning.value = true;
  scanOutput.value = '';
  try {
    const res = await $fetch('/api/scan', { method: 'POST' });
    scanOutput.value = res.output;
    await refreshBooks();
  } catch (err) {
    scanOutput.value = '掃描失敗：' + err.message;
  } finally {
    scanning.value = false;
  }
}
</script>