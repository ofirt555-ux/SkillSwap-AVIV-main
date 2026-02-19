// ===== main.js — SkillSwap ==========================================================
// All site-wide JavaScript + jQuery functionality

$(document).ready(function () {

  // =====================================================================================
  // GLOBAL — Tooltips for unimplemented links
  // =====================================================================================
  // Footer links
  $('.footer-nav a[href="#"]').attr('title', 'This feature is not yet available');

  // View Job links
  $('.job-link[href="#"]').attr('title', 'This feature is not yet available');

  // Action buttons (View, Edit, View Applicants) — but not filters or Mark Complete
  $('.view-btn[href="#"]').attr('title', 'This feature is not yet available');
  $('.edit-btn[href="#"]').attr('title', 'This feature is not yet available');
  $('.applicants-btn[href="#"]').attr('title', 'This feature is not yet available');

  // Forgot password + Terms of Service
  $('.forgot-link[href="#"]').attr('title', 'This feature is not yet available');
  $('.terms-link[href="#"]').attr('title', 'This feature is not yet available');

  // =====================================================================================
  // INDEX PAGE — Category Filters + Search (jQuery)
  // =====================================================================================
  if ($('.filter-nav').length && $('.job-listings').length) {

    // Category filter buttons
    $('.filter-nav li a').on('click', function (e) {
      e.preventDefault();

      // Update active state
      $('.filter-nav li a').removeClass('active');
      $(this).addClass('active');

      var filter = $(this).text().trim().toLowerCase();

      if (filter === 'all') {
        $('.job-card').fadeIn(300);
      } else {
        $('.job-card').each(function () {
          var category = $(this).find('.job-meta').text().toLowerCase();
          if (category.indexOf(filter) !== -1) {
            $(this).fadeIn(300);
          } else {
            $(this).fadeOut(200);
          }
        });
      }
    });

    // Search functionality
    $('.search-form input').on('input', function () {
      var query = $(this).val().toLowerCase();

      // Reset filter tabs to "All"
      $('.filter-nav li a').removeClass('active');
      $('.filter-nav li a').first().addClass('active');

      $('.job-card').each(function () {
        var title = $(this).find('.job-title').text().toLowerCase();
        var category = $(this).find('.job-meta').text().toLowerCase();
        if (title.indexOf(query) !== -1 || category.indexOf(query) !== -1) {
          $(this).fadeIn(300);
        } else {
          $(this).fadeOut(200);
        }
      });
    });

    // Prevent form submission on search
    $('.search-form').on('submit', function (e) {
      e.preventDefault();
    });
  }

  // =====================================================================================
  // MY JOBS PAGE — Filter Tabs (jQuery)
  // =====================================================================================
  if ($('.jobs-filter-nav').length && $('.my-jobs-list').length) {

    $('.jobs-filter-nav li a').on('click', function (e) {
      e.preventDefault();

      $('.jobs-filter-nav li a').removeClass('active');
      $(this).addClass('active');

      var filter = $(this).text().trim().toLowerCase();

      if (filter === 'all') {
        $('.my-job-card').fadeIn(300);
      } else if (filter === 'posted by me') {
        $('.my-job-card').each(function () {
          var type = $(this).find('.job-type-badge').text().toLowerCase();
          if (type.indexOf('posted by me') !== -1) {
            $(this).fadeIn(300);
          } else {
            $(this).fadeOut(200);
          }
        });
      } else if (filter === 'in progress') {
        $('.my-job-card').each(function () {
          var status = $(this).find('.status-badge').text().toLowerCase();
          if (status.indexOf('in progress') !== -1) {
            $(this).fadeIn(300);
          } else {
            $(this).fadeOut(200);
          }
        });
      } else if (filter === 'completed') {
        $('.my-job-card').each(function () {
          var status = $(this).find('.status-badge').text().toLowerCase();
          if (status.indexOf('completed') !== -1) {
            $(this).fadeIn(300);
          } else {
            $(this).fadeOut(200);
          }
        });
      }
    });

    // Mark Complete button feedback
    $('.complete-btn').on('click', function (e) {
      e.preventDefault();
      var card = $(this).closest('.my-job-card');
      card.find('.status-badge')
        .removeClass('status-progress')
        .addClass('status-completed')
        .text('Completed');
      $(this).text('✓ Done').css({ 'pointer-events': 'none', 'opacity': '0.6' });
    });
  }

  // =====================================================================================
  // MY CREDITS PAGE — Total Calculation
  // =====================================================================================
  if ($('#totalAmount').length) {
    var total = 0;
    $('.t-amount').each(function () {
      total += parseInt($(this).text());
    });
    $('#totalAmount').text(total);
  }

  // =====================================================================================
  // POST JOB PAGE — Image Upload + Validations + Feedback
  // =====================================================================================
  if ($('#uploadArea').length) {

    var uploadArea = document.getElementById('uploadArea');
    var fileInput = document.getElementById('jobImage');
    var imagePreview = document.getElementById('imagePreview');

    uploadArea.addEventListener('click', function () { fileInput.click(); });

    uploadArea.addEventListener('dragover', function (e) {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function () {
      uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function (e) {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        showPreview(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', function () {
      if (fileInput.files.length) {
        showPreview(fileInput.files[0]);
      }
    });

    function showPreview(file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.innerHTML = '<img src="' + e.target.result + '" alt="Preview" />';
        imagePreview.style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  }

  // Post Job form validation (custom JS validations)
  if ($('.postjob-form').length) {
    $('.postjob-form').on('submit', function (e) {
      e.preventDefault();
      var errors = [];

      // 1. Title: must be at least 3 characters
      var title = $('#jobTitle').val().trim();
      if (title.length < 3) {
        errors.push('Job title must be at least 3 characters long.');
        $('#jobTitle').addClass('input-error');
      } else {
        $('#jobTitle').removeClass('input-error');
      }

      // 2. Category: must be selected
      var category = $('#jobCategory').val();
      if (!category) {
        errors.push('Please select a category.');
        $('#jobCategory').addClass('input-error');
      } else {
        $('#jobCategory').removeClass('input-error');
      }

      // 3. Credits: must be between 5 and 500 (custom JS validation)
      var credits = parseInt($('#jobCredits').val());
      if (isNaN(credits) || credits < 5 || credits > 500) {
        errors.push('Credits must be between 5 and 500.');
        $('#jobCredits').addClass('input-error');
      } else {
        $('#jobCredits').removeClass('input-error');
      }

      // 4. Description: must be at least 20 characters (custom JS validation)
      var description = $('#jobDescription').val().trim();
      if (description.length < 20) {
        errors.push('Description must be at least 20 characters long.');
        $('#jobDescription').addClass('input-error');
      } else {
        $('#jobDescription').removeClass('input-error');
      }

      // Show errors or success
      $('.form-error-list').remove();
      $('.form-success-msg').remove();

      if (errors.length > 0) {
        var errorHtml = '<div class="form-error-list"><ul>';
        for (var i = 0; i < errors.length; i++) {
          errorHtml += '<li>' + errors[i] + '</li>';
        }
        errorHtml += '</ul></div>';
        $('.form-actions').before(errorHtml);
      } else {
        // Save job to localStorage for data transfer between pages
        var job = {
          title: title,
          category: $('#jobCategory option:selected').text(),
          credits: credits,
          description: description,
          location: $('#jobLocation option:selected').text() || 'Not specified',
          deadline: $('#jobDeadline').val() || 'No deadline',
          date: new Date().toLocaleDateString()
        };

        // Save to localStorage
        var savedJobs = JSON.parse(localStorage.getItem('postedJobs') || '[]');
        savedJobs.push(job);
        localStorage.setItem('postedJobs', JSON.stringify(savedJobs));

        var successHtml = '<div class="form-success-msg">✓ Job posted successfully!</div>';
        $('.form-actions').before(successHtml);

        // Reset form after short delay
        var form = this;
        setTimeout(function () {
          form.reset();
          if (imagePreview) {
            imagePreview.innerHTML = '';
            imagePreview.style.display = 'none';
          }
        }, 2000);
      }
    });

    // Remove error highlight on input focus
    $('.postjob-form .form-input, .postjob-form .form-select, .postjob-form .form-textarea').on('focus', function () {
      $(this).removeClass('input-error');
    });
  }

  // =====================================================================================
  // SIGN UP PAGE — Tab Switch + Validation + Feedback
  // =====================================================================================
  if ($('.auth-tabs').length) {

    // Tab switching (jQuery version)
    $('.auth-tab').on('click', function () {
      var tab = $(this).attr('id') === 'loginTab' ? 'login' : 'signup';

      if (tab === 'login') {
        $('#loginForm').removeClass('hidden');
        $('#signupForm').addClass('hidden');
        $('#loginTab').addClass('active');
        $('#signupTab').removeClass('active');
      } else {
        $('#signupForm').removeClass('hidden');
        $('#loginForm').addClass('hidden');
        $('#signupTab').addClass('active');
        $('#loginTab').removeClass('active');
      }
    });

    // Sign Up form submission
    $('#signupForm').on('submit', function (e) {
      e.preventDefault();
      var errors = [];

      var firstName = $('#firstName').val().trim();
      var lastName = $('#lastName').val().trim();
      var email = $('#signupEmail').val().trim();
      var password = $('#signupPassword').val();
      var confirm = $('#confirmPassword').val();

      // Validate name (at least 2 chars, letters only)
      var nameRegex = /^[A-Za-z\u0590-\u05FF]{2,}$/;
      if (!nameRegex.test(firstName)) {
        errors.push('First name must be at least 2 letters.');
        $('#firstName').addClass('input-error');
      } else {
        $('#firstName').removeClass('input-error');
      }

      if (!nameRegex.test(lastName)) {
        errors.push('Last name must be at least 2 letters.');
        $('#lastName').addClass('input-error');
      } else {
        $('#lastName').removeClass('input-error');
      }

      // Validate email format
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Please enter a valid email address.');
        $('#signupEmail').addClass('input-error');
      } else {
        $('#signupEmail').removeClass('input-error');
      }

      // Validate password (min 8 chars, at least 1 number)
      if (password.length < 8 || !/\d/.test(password)) {
        errors.push('Password must be at least 8 characters with at least 1 number.');
        $('#signupPassword').addClass('input-error');
      } else {
        $('#signupPassword').removeClass('input-error');
      }

      // Passwords match
      if (password !== confirm) {
        errors.push('Passwords do not match.');
        $('#confirmPassword').addClass('input-error');
      } else {
        $('#confirmPassword').removeClass('input-error');
      }

      // Terms agreement
      if (!$('#agreeTerms').is(':checked')) {
        errors.push('You must agree to the Terms of Service.');
      }

      // Show errors or success
      $('.form-error-list').remove();

      if (errors.length > 0) {
        var errorHtml = '<div class="form-error-list"><ul>';
        for (var i = 0; i < errors.length; i++) {
          errorHtml += '<li>' + errors[i] + '</li>';
        }
        errorHtml += '</ul></div>';
        $('#signupForm .auth-btn').first().before(errorHtml);
      } else {
        $('#signupSuccess').removeClass('hidden');
        $('#signupSuccess')[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Login form feedback
    $('#loginForm').on('submit', function (e) {
      e.preventDefault();

      var email = $('#loginEmail').val().trim();
      var password = $('#loginPassword').val();

      if (!email || !password) {
        alert('Please fill in all fields.');
        return;
      }

      // Show login feedback
      $('.login-success').remove();
      var msg = '<div class="login-success form-success-msg">✓ Logged in successfully! Redirecting...</div>';
      $('#loginForm .auth-btn').first().after(msg);

      setTimeout(function () {
        window.location.href = '../index.html';
      }, 2000);
    });

    // Remove error highlight on input focus
    $('.auth-form .form-input').on('focus', function () {
      $(this).removeClass('input-error');
    });
  }

  // =====================================================================================
  // BUY CREDITS BUTTON FEEDBACK (MyCredits page)
  // =====================================================================================
  $('.buybtn').on('click', function () {
    $(this).text('✓ Coming Soon!').css({ 'opacity': '0.7', 'pointer-events': 'none' });
    var btn = $(this);
    setTimeout(function () {
      btn.text('buy credits').css({ 'opacity': '1', 'pointer-events': 'auto' });
    }, 2000);
  });

});
