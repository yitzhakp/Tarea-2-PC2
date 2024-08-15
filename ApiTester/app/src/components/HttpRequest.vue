<template>
  <div class="p-4">
    <form @submit.prevent="sendRequest">
      <div class="input-group mb-4">
        <select class="form-select flex-grow-0 w-auto" v-model="method">
          <option value="GET" selected>GET</option>
          <option value="PUT">PUT</option>
          <option value="POST">POST</option>
          <option value="DELETE">DELETE</option>
        </select>
        <input v-model="url" required class="form-control" type="url" placeholder="https://example.com"/>
        <button type="submit" class="btn btn-primary">Send</button>
      </div>
      <ul class="nav nav-tabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="query-params-tab" data-bs-toggle="tab" data-bs-target="#query-params"
          type="button" role="tab" aria-controls="query-params" aria-selected="true">Query Params</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="body-tab" data-bs-toggle="tab" data-bs-target="#body"
          type="button" role="tab" aria-controls="body" aria-selected="false">Body</button>
        </li>
      </ul>
      <div class="tab-content p-3 border-top-0 border">
        <div class="tab-pane fade" id="query-params" role="tabpanel" aria-labelledby="query-params-tab">
          <div class="input-group">
            <input v-model="queryParams" id="queryParams" class="form-control" placeholder="Enter query parameters (e.g., param1=key1&param2=key2)"/>
          </div>
        </div>

        <div class="tab-pane fade" id="body" role="tabpanel" aria-labelledby="body-tab">
          <textarea v-model="requestBody" id="requestBody" class="form-control" rows="5" placeholder="Enter request body"></textarea>
        </div>
      </div>
    </form>
    <div class="mt-5" :class="{ 'd-none': !isResponseVisible }" data-response-section>
      <h3>Response</h3>
      <div class="d-flex my-2">
        <div class="me-3">
          Time: <span data-time></span>ms
        </div>
      </div>
      <div class="tab-content p-3 border-top-0 border">
        <div class="tab-pane fade show active" id="response-body" role="tabpanel" aria-labelledby="body-tab">
          <pre ref="jsonResponseBody" class="overflow-auto" style="max-height: 560px;"></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      method: "GET",
      url: "",
      isResponseVisible: false,
      requestBody: "",
      queryParams: "",
    };
  },
  methods: {
    async sendRequest() {
      try {
        const startTime = performance.now();
        const options = this.buildOptions();
        const fullUrl = this.buildFullUrl();
        const response = await fetch(fullUrl, options);
        await this.handleResponse(response, startTime);
      } catch (error) {
        console.error('There was an error!', error);
        this.hideResponseInfo();
        this.showNotification(`Error: ${error.message}`);
      }
    },

    buildOptions() {
      const options = {
        method: this.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (this.method === 'POST' || this.method === 'PUT' || this.method === 'DELETE') {
        this.setRequestBody(options);
      }

      return options;
    },

    setRequestBody(options) {
      options.body = this.requestBody;
    },

    buildFullUrl() {
      let fullUrl = this.url;

      if (this.method === 'GET' && this.queryParams.trim() !== '') {
        const params = new URLSearchParams(this.queryParams.trim());
        fullUrl += '?' + params.toString();
      }

      return fullUrl;
    },

    async handleResponse(response, startTime) {
      const data = await response.json();
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;

      this.showResponseSection();
      this.updateResponseInfo(elapsedTime);
      this.$refs.jsonResponseBody.textContent = JSON.stringify(data, null, 2);
    },

    showResponseSection() {
      this.isResponseVisible = true;
    },

    updateResponseInfo(time) {
      const timeElement = document.querySelector('[data-time]');
      timeElement.textContent = time.toFixed(2);
    },

    hideResponseInfo() {
      this.isResponseVisible = false;
    },

    showNotification(message) {
      alert(message);
    },
  },
};
</script>