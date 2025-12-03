// Case Detail Page
import { render } from '../main.js';
import { getIcon } from '../icons.js';

export async function renderCaseDetailPage(params) {
    const caseId = params[0];
    const casesData = await window.loadData('cases');
    const caseItem = casesData?.cases?.find(c => c.id === caseId);
    
    if (!caseItem) {
        render(`
            <div class="container">
                <div class="error-message">
                    <h2>사례를 찾을 수 없습니다</h2>
                    <button class="btn btn-primary" onclick="window.location.hash='#/cases'">
                        사례 목록으로 돌아가기
                    </button>
                </div>
            </div>
        `);
        return;
    }
    
    const html = `
        <div class="case-detail-page">
            <div class="container">
                <!-- Breadcrumb -->
                <nav class="breadcrumb">
                    <a href="#/cases">사례</a>
                    <span>/</span>
                    <span>${caseItem.title}</span>
                </nav>

                <!-- Case Header -->
                <div class="case-detail-header">
                    <div class="case-detail-meta">
                        <span class="case-category-badge">${getCategoryName(caseItem.category)}</span>
                        <span class="case-year-badge">${caseItem.year}</span>
                    </div>
                    <h1 class="case-detail-title">${caseItem.title}</h1>
                    <p class="case-detail-client">클라이언트: ${caseItem.client}</p>
                    <p class="case-detail-location">
                        <span class="location-icon">${getIcon('location', 20)}</span>
                        ${caseItem.location}
                    </p>
                </div>

                <!-- Case Gallery -->
                <div class="case-gallery">
                    ${caseItem.images?.length > 0 ? `
                        <div class="gallery-main" id="galleryMain">
                            <img src="${caseItem.images[0]}" alt="${caseItem.title}" />
                        </div>
                        ${caseItem.images.length > 1 ? `
                            <div class="gallery-thumbnails">
                                ${caseItem.images.map((img, index) => `
                                    <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-image="${img}" data-index="${index}">
                                        <img src="${img}" alt="${caseItem.title} ${index + 1}" />
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    ` : `
                        <div class="gallery-main" style="background: linear-gradient(135deg, #00bfa5, #1a1a1a);">
                            <div class="gallery-placeholder">
                                ${getCategoryIcon(caseItem.category)}
                                <p>이미지 준비 중</p>
                            </div>
                        </div>
                    `}
                </div>

                <!-- Case Description -->
                <div class="case-detail-content">
                    <section class="detail-section">
                        <h2>프로젝트 개요</h2>
                        <p>${caseItem.description}</p>
                    </section>

                    <!-- Project Details -->
                    <section class="detail-section">
                        <h2>프로젝트 상세</h2>
                        <div class="detail-grid">
                            <div class="detail-item card">
                                <h4>기간</h4>
                                <p>${caseItem.details?.duration || '-'}</p>
                            </div>
                            <div class="detail-item card">
                                <h4>범위</h4>
                                <p>${caseItem.details?.scope || '-'}</p>
                            </div>
                            <div class="detail-item card">
                                <h4>기술</h4>
                                <p>${caseItem.details?.technology || '-'}</p>
                            </div>
                        </div>
                    </section>

                    <!-- Features -->
                    ${caseItem.details?.features ? `
                        <section class="detail-section">
                            <h2>주요 특징</h2>
                            <ul class="features-list">
                                ${caseItem.details.features.map(feature => `
                                    <li>${feature}</li>
                                `).join('')}
                            </ul>
                        </section>
                    ` : ''}

                    <!-- Tags -->
                    ${caseItem.tags ? `
                        <section class="detail-section">
                            <div class="case-detail-tags">
                                ${caseItem.tags.map(tag => `
                                    <span class="tag">${tag}</span>
                                `).join('')}
                            </div>
                        </section>
                    ` : ''}

                    <!-- CTA -->
                    <section class="detail-section">
                        <div class="cta-box">
                            <h3>비슷한 프로젝트를 진행하고 싶으신가요?</h3>
                            <p>전문가와 상담하여 프로젝트를 시작해보세요</p>
                            <button class="btn btn-secondary btn-large" onclick="window.location.hash='#/contact'">
                                상담 신청
                            </button>
                        </div>
                    </section>

                    <!-- Navigation -->
                    <div class="case-navigation">
                        <button class="btn btn-outline" onclick="window.location.hash='#/cases'">
                            ← 목록으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    render(html);
    
    // Gallery thumbnail click handler
    if (caseItem.images?.length > 1) {
        const galleryMain = document.getElementById('galleryMain');
        const thumbnails = document.querySelectorAll('.gallery-thumb');
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const imageSrc = thumb.getAttribute('data-image');
                const mainImg = galleryMain.querySelector('img');
                
                // Update main image
                mainImg.src = imageSrc;
                
                // Update active state
                thumbnails.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });
    }
}

function getCategoryIcon(category) {
    return getIcon(category, 80);
}

function getCategoryName(category) {
    const names = {
        '3d': '3D',
        '4d': '4D',
        'vr-ar': 'VR/AR',
        'interactive': 'Interactive',
        'motion-simulator': 'Motion Simulator',
        'motion-controller': 'Motion Controller'
    };
    return names[category] || category;
}
