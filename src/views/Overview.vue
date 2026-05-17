<template>
  <div class="status-dashboard">
    <div class="status-grid">
      <div class="status-card completed">
        <span class="label">Reading</span>
        <span class="badge">已完成</span>
      </div>
      <div class="status-card completed">
        <span class="label">Listening</span>
        <span class="badge">已完成</span>
      </div>
    </div>

    <div class="hero-display">
      <div class="content-wrapper">
        <h3 class="mt-4">恭喜！你已經完成大部分挑戰</h3>
        <p class="text-grey">剩下最後幾步，加油！</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.status-dashboard {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;

  .status-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .status-card {
    padding: 16px;
    border-radius: 16px;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s;

    &.completed {
      background-color: #f0fdf4;
      border-color: #bbf7d0;
      color: #166534;
    }

    &.in-progress {
      background-color: #eff6ff;
      border-color: #bfdbfe;
      color: #1e40af;
    }

    &.pending {
      background-color: #f9fafb;
      color: #6b7280;
    }

    .badge {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.6);
      margin-top: 8px;
      font-weight: bold;
    }
  }

  .hero-display {
    background: #ffffff;
    border: 2px dashed #e5e7eb;
    border-radius: 24px;
    padding: 40px;
    text-align: center;

    .hero-image {
      width: 150px;
      filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1));
    }
  }
}
</style>
