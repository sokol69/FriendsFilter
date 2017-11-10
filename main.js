function api(method, params) {
	return new Promise((resolve, reject) => {
		VK.api(method, params, data => {
			if (data.error) {
				reject(new Error(data.error.error_msg));
			} else {
				resolve(data.response);
			}
		});
	});
}

var promise = new Promise((resolve, reject) => {
	VK.init({
		apiId: 6197002
	});

	VK.Auth.login(data => {
		if (data.session) {
			resolve(data);
		} else {
			reject(new Error('Не удалось авторизоваться'));
		}
	}, 8);
});

promise
	.then(data => {
		return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_50' })
	})

	.then(data => {
		const templateElement = document.querySelector('#user-template');
		const myFriends = document.querySelector('#my_friends');
		const source = templateElement.innerHTML,
		render = Handlebars.compile(source),
		template = render({ list: data.items });

		myFriends.innerHTML = template;
	})

	.then(function() {
		var myFriends = document.querySelector('#my_friends'),
			fl = document.querySelector('#friends_list'),
			inputLeft = document.querySelector('#name_left'),
			inputRight = document.querySelector('#name_right'),
			saveButton = document.querySelector('#button__save'),
			delAll = document.querySelector('#button__delete_all'),
			arrAdd = document.querySelectorAll('.add'),
			initialMyFriends = myFriends.innerHTML;

		myFriends.addEventListener('click', function(e) {
			var target = e.target;
			if (target.tagName !== 'BUTTON') {
				return;
			} else {
				fl.appendChild(target.parentNode);
				target.style.transform = 'rotate(45deg)';
				target.parentNode.classList.add('back');
			};
		});

		fl.addEventListener('click', function(e) {
			var target = e.target;
			if (target.tagName !== 'BUTTON') { 
				return;
			} else {
				myFriends.insertBefore(target.parentNode, myFriends.firstChild);
				target.style.transform = 'rotate(0deg)';
				target.parentNode.classList.remove('back');
			};
		});

		inputLeft.addEventListener('keyup', function() {
			var mfWrap = myFriends.querySelectorAll('.mf_wrap');
			searchFriends(mfWrap, inputLeft.value);
		});

		inputRight.addEventListener('keyup', function() {
			var targetNames = document.querySelectorAll('.back');
			searchFriends(targetNames, inputRight.value);
		});

		delAll.addEventListener('click', function() {
			myFriends.innerHTML = initialMyFriends;
			fl.innerHTML = null;
			localStorage.removeItem('saveFriends');
			localStorage.removeItem('saveTargetFriends');
		});

		saveButton.addEventListener('click', function() {
			localStorage.setItem('saveTargetFriends', fl.innerHTML);
			localStorage.setItem('saveFriends', myFriends.innerHTML);
			alert('Сохранено!');
		});

		var searchFriends = function(names, inputValue) {
			for (var i = 0; i < names.length; i++) {
				if (!isMatching(names[i].innerText, inputValue)) {
					names[i].style.display = 'none';
				} else {
					names[i].style.display = 'flex';
				}
			}
		};

		var isMatching = function(full, chunk) {
			full = full.toLowerCase();
			chunk = chunk.toLowerCase();
			if (~full.indexOf(chunk)) {
				return true;
			} else {
				return false;
			}
		};

	})

	.then(function() {
		var fl = document.querySelector('#friends_list'),
			myFriends = document.querySelector('#my_friends');

		if(localStorage.saveTargetFriends) {
			fl.innerHTML = localStorage.getItem('saveTargetFriends');
			myFriends.innerHTML = localStorage.getItem('saveFriends');
		}
	})

	.catch(function (e) {
		alert('Ошибка: ' + e.message);
	});