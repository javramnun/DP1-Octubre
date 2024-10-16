package org.springframework.samples.petclinic.auth;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.samples.petclinic.auth.payload.request.SignupRequest;
import org.springframework.samples.petclinic.player.Player;
import org.springframework.samples.petclinic.player.PlayerService;
import org.springframework.samples.petclinic.user.Authorities;
import org.springframework.samples.petclinic.user.AuthoritiesService;
import org.springframework.samples.petclinic.user.User;
import org.springframework.samples.petclinic.user.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

	private final PasswordEncoder encoder;
	private final AuthoritiesService authoritiesService;
	private final UserService userService;
	private final PlayerService playerService;

	@Autowired
	public AuthService(PasswordEncoder encoder, AuthoritiesService authoritiesService, UserService userService, 
			PlayerService playerService) {
		this.encoder = encoder;
		this.authoritiesService = authoritiesService;
		this.userService = userService;
		this.playerService = playerService;
	}

	@Transactional
	public void createUser(@Valid SignupRequest request) {
		User user = new User();
		user.setUsername(request.getUsername());
		user.setPassword(encoder.encode(request.getPassword()));
		String strRoles = request.getAuthority();
		Authorities role;

		switch (strRoles.toLowerCase()) {
		case "admin":
			role = authoritiesService.findByAuthority("ADMIN");
			user.setAuthority(role);
			userService.saveUser(user);
			break;
		default:
			role = authoritiesService.findByAuthority("PLAYER");
			user.setAuthority(role);
			userService.saveUser(user);
			Player player = new Player();
			player.setFirstName(request.getFirstName());
			player.setLastName(request.getLastName());
			player.setPlayerUsername(request.getPlayerUsername());
			player.setUser(user);
			playerService.savePlayer(player);

		}
	}

}
