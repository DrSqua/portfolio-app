<script>
	import { onMount, onDestroy } from 'svelte';

	let canvas;
	let animationId;

	const CONFIG = {
		datacenterCount: 6,
		nodesPerDatacenter: { min: 10, max: 16 },
		datacenterRadius: 130,
		returnForce: 0.0018,      // very gentle — just a soft nudge
		damping: 0.994,           // high damping keeps motion slow and smooth
		baseSpeed: 0.22,

		intraEdgeMaxDist: 140,
		edgeOpacityMax: 0.28,
		backboneOpacity: 0.16,

		pulseCount: 60,
		pulseSpeed: { min: 0.3, max: 0.9 },
		pulseRadius: 3,
		pulseTrailLength: 0.08,

		// Colors from brand palette
		bgColor: 'rgb(20,30,26)',
		dcGlowColor: 'rgb(93,202,165)',
		nodeCoreFill: 'rgb(36,54,47)',
		nodeHubFill: 'rgb(58,85,73)',
		nodeRimColor: 'rgb(93,202,165)',
		nodeHubRimColor: 'rgb(159,225,203)',
		intraEdgeColor: 'rgb(93,202,165)',
		backboneEdgeColor: 'rgb(133,183,235)',
		pulseColorIntra: 'rgb(159,225,203)',
		pulseColorBackbone: 'rgb(133,183,235)',
		pulseGlowIntra: 'rgb(93,202,165)',
		pulseGlowBackbone: 'rgb(133,183,235)',
	};

	let datacenters = [];
	let allNodes = [];
	let intraEdges = [];
	let backboneEdges = [];
	let pulses = [];
	let W = 0, H = 0;

	function rand(min, max) { return min + Math.random() * (max - min); }
	function randInt(min, max) { return Math.floor(rand(min, max + 1)); }

	function placeDCCenters(count) {
		const margin = 180;
		const centers = [];
		let attempts = 0;
		while (centers.length < count && attempts < 5000) {
			attempts++;
			const x = rand(margin, W - margin);
			const y = rand(margin, H - margin);
			const minDist = Math.min(W, H) * 0.24;
			if (centers.every(c => Math.hypot(c.x - x, c.y - y) > minDist)) {
				centers.push({ x, y });
			}
		}
		return centers;
	}

	function initDatacenters() {
		allNodes = [];
		datacenters = [];
		pulses = [];

		const centers = placeDCCenters(CONFIG.datacenterCount);

		for (const center of centers) {
			const nodeCount = randInt(CONFIG.nodesPerDatacenter.min, CONFIG.nodesPerDatacenter.max);
			const dcNodes = [];

			for (let i = 0; i < nodeCount; i++) {
				// Spread nodes in a loose disc — not too clustered
				const angle = rand(0, Math.PI * 2);
				const dist = rand(CONFIG.datacenterRadius * 0.15, CONFIG.datacenterRadius * 0.9);
				const node = {
					x: center.x + Math.cos(angle) * dist,
					y: center.y + Math.sin(angle) * dist,
					vx: rand(-CONFIG.baseSpeed, CONFIG.baseSpeed),
					vy: rand(-CONFIG.baseSpeed, CONFIG.baseSpeed),
					r: rand(2.2, 5),
					dcX: center.x,
					dcY: center.y,
					isHub: i === 0,
					wobbleOffset: rand(0, Math.PI * 2),
					wobbleSpeed: rand(0.25, 0.6),
				};
				dcNodes.push(node);
				allNodes.push(node);
			}

			datacenters.push({ x: center.x, y: center.y, hubNode: dcNodes[0], nodes: dcNodes });
		}

		buildEdges();
		initPulses();
	}

	function buildEdges() {
		intraEdges = [];
		backboneEdges = [];

		for (const dc of datacenters) {
			for (let i = 0; i < dc.nodes.length; i++) {
				for (let j = i + 1; j < dc.nodes.length; j++) {
					const a = dc.nodes[i], b = dc.nodes[j];
					const dist = Math.hypot(a.x - b.x, a.y - b.y);
					if (dist < CONFIG.intraEdgeMaxDist) {
						intraEdges.push({ a, b, dist });
					}
				}
			}
		}

		for (let i = 0; i < datacenters.length; i++) {
			for (let j = i + 1; j < datacenters.length; j++) {
				const a = datacenters[i].hubNode;
				const b = datacenters[j].hubNode;
				backboneEdges.push({ a, b });
			}
		}
	}

	function initPulses() {
		pulses = [];
		const all = [...intraEdges, ...backboneEdges];
		for (let i = 0; i < CONFIG.pulseCount; i++) {
			spawnPulse(rand(0, 1), all);
		}
	}

	function spawnPulse(t = 0, edgePool = null) {
		const useBackbone = Math.random() < 0.35 && backboneEdges.length > 0;
		const pool = edgePool
			? edgePool
			: (useBackbone ? backboneEdges : (intraEdges.length > 0 ? intraEdges : backboneEdges));
		// When spawning fresh, respect backbone weight
		const actualPool = edgePool
			? (Math.random() < 0.35 && backboneEdges.length > 0 ? backboneEdges : intraEdges.length > 0 ? intraEdges : backboneEdges)
			: pool;
		if (actualPool.length === 0) return;
		const edge = actualPool[Math.floor(Math.random() * actualPool.length)];
		const isBackbone = backboneEdges.includes(edge);
		pulses.push({
			edge,
			t,
			speed: rand(CONFIG.pulseSpeed.min, CONFIG.pulseSpeed.max),
			reverse: Math.random() < 0.5,
			isBackbone,
		});
	}

	function resize() {
		W = canvas.offsetWidth;
		H = canvas.offsetHeight;
		canvas.width = W * devicePixelRatio;
		canvas.height = H * devicePixelRatio;
		initDatacenters();
	}

	let lastTime = 0;

	function draw(ts) {
		animationId = requestAnimationFrame(draw);
		const dt = Math.min((ts - lastTime) / 1000, 0.05);
		lastTime = ts;

		const ctx = canvas.getContext('2d');
		const dpr = devicePixelRatio;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		ctx.fillStyle = CONFIG.bgColor;
		ctx.fillRect(0, 0, W, H);

		// Move nodes
		for (const n of allNodes) {
			// Very gentle sine wobble
			const wobble = Math.sin(ts * 0.001 * n.wobbleSpeed + n.wobbleOffset);
			n.vx += wobble * 0.0015;
			n.vy += Math.cos(ts * 0.001 * n.wobbleSpeed + n.wobbleOffset) * 0.0015;

			// Soft spring — only kicks in outside a comfortable radius
			const dx = n.dcX - n.x;
			const dy = n.dcY - n.y;
			const distFromHome = Math.hypot(dx, dy);
			// Spring only activates beyond 60% of datacenter radius
			if (distFromHome > CONFIG.datacenterRadius * 0.6) {
				const strength = CONFIG.returnForce * ((distFromHome / CONFIG.datacenterRadius) - 0.6);
				n.vx += (dx / distFromHome) * strength * 60;
				n.vy += (dy / distFromHome) * strength * 60;
			}

			n.vx *= CONFIG.damping;
			n.vy *= CONFIG.damping;

			n.x += n.vx * dt * 60;
			n.y += n.vy * dt * 60;
		}

		buildEdges();

		// DC auras
		for (const dc of datacenters) {
			const r = CONFIG.datacenterRadius * 1.2;
			const grad = ctx.createRadialGradient(dc.x, dc.y, r * 0.2, dc.x, dc.y, r);
			grad.addColorStop(0, 'rgba(93,202,165,0.05)');
			grad.addColorStop(0.65, 'rgba(93,202,165,0.03)');
			grad.addColorStop(1, 'rgba(93,202,165,0)');
			ctx.beginPath();
			ctx.arc(dc.x, dc.y, r, 0, Math.PI * 2);
			ctx.fillStyle = grad;
			ctx.fill();

			// Dashed perimeter
			ctx.beginPath();
			ctx.arc(dc.x, dc.y, r * 0.88, 0, Math.PI * 2);
			ctx.setLineDash([3, 9]);
			ctx.strokeStyle = 'rgba(93,202,165,0.15)';
			ctx.lineWidth = 1;
			ctx.stroke();
			ctx.setLineDash([]);
		}

		// Backbone edges
		ctx.setLineDash([5, 11]);
		for (const e of backboneEdges) {
			ctx.beginPath();
			ctx.moveTo(e.a.x, e.a.y);
			ctx.lineTo(e.b.x, e.b.y);
			ctx.strokeStyle = CONFIG.backboneEdgeColor;
			ctx.globalAlpha = CONFIG.backboneOpacity;
			ctx.lineWidth = 1;
			ctx.stroke();
		}
		ctx.setLineDash([]);

		// Intra edges
		for (const e of intraEdges) {
			const alpha = CONFIG.edgeOpacityMax * (1 - e.dist / CONFIG.intraEdgeMaxDist);
			ctx.beginPath();
			ctx.moveTo(e.a.x, e.a.y);
			ctx.lineTo(e.b.x, e.b.y);
			ctx.strokeStyle = CONFIG.intraEdgeColor;
			ctx.globalAlpha = alpha;
			ctx.lineWidth = 1;
			ctx.stroke();
		}
		ctx.globalAlpha = 1;

		// Nodes
		for (const n of allNodes) {
			const glowR = n.r * (n.isHub ? 6 : 4.5);
			const rimColor = n.isHub ? CONFIG.nodeHubRimColor : CONFIG.nodeRimColor;
			const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
			grad.addColorStop(0, n.isHub ? 'rgba(159,225,203,0.18)' : 'rgba(93,202,165,0.12)');
			grad.addColorStop(1, 'rgba(93,202,165,0)');
			ctx.beginPath();
			ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
			ctx.fillStyle = grad;
			ctx.fill();

			ctx.beginPath();
			ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
			ctx.fillStyle = n.isHub ? CONFIG.nodeHubFill : CONFIG.nodeCoreFill;
			ctx.fill();
			ctx.strokeStyle = n.isHub ? 'rgba(159,225,203,0.85)' : 'rgba(93,202,165,0.5)';
			ctx.lineWidth = n.isHub ? 1.5 : 1;
			ctx.stroke();
		}

		// Pulses
		const dead = [];
		for (let i = 0; i < pulses.length; i++) {
			const p = pulses[i];
			p.t += p.speed * dt;
			if (p.t >= 1) { dead.push(i); continue; }

			const { a, b } = p.edge;
			const progress = p.reverse ? 1 - p.t : p.t;
			const px = a.x + (b.x - a.x) * progress;
			const py = a.y + (b.y - a.y) * progress;

			const pulseCol = p.isBackbone ? CONFIG.pulseColorBackbone : CONFIG.pulseColorIntra;
			const glowCol = p.isBackbone ? CONFIG.pulseGlowBackbone : CONFIG.pulseGlowIntra;

			// Outer glow
			const glowR = CONFIG.pulseRadius * 5.5;
			const gGlow = ctx.createRadialGradient(px, py, 0, px, py, glowR);
			gGlow.addColorStop(0, p.isBackbone ? 'rgba(133,183,235,0.3)' : 'rgba(93,202,165,0.3)');
			gGlow.addColorStop(1, p.isBackbone ? 'rgba(133,183,235,0)' : 'rgba(93,202,165,0)');
			ctx.beginPath();
			ctx.arc(px, py, glowR, 0, Math.PI * 2);
			ctx.fillStyle = gGlow;
			ctx.fill();

			// Core dot
			ctx.beginPath();
			ctx.arc(px, py, CONFIG.pulseRadius, 0, Math.PI * 2);
			ctx.fillStyle = pulseCol;
			ctx.globalAlpha = 0.7;
			ctx.fill();
			ctx.globalAlpha = 1;

			// Trail
			const trailT = Math.max(0, progress - CONFIG.pulseTrailLength);
			const tx = a.x + (b.x - a.x) * trailT;
			const ty = a.y + (b.y - a.y) * trailT;
			const trailGrad = ctx.createLinearGradient(tx, ty, px, py);
			trailGrad.addColorStop(0, p.isBackbone ? 'rgba(133,183,235,0)' : 'rgba(159,225,203,0)');
			trailGrad.addColorStop(1, p.isBackbone ? 'rgba(133,183,235,0.55)' : 'rgba(159,225,203,0.55)');
			ctx.beginPath();
			ctx.moveTo(tx, ty);
			ctx.lineTo(px, py);
			ctx.strokeStyle = trailGrad;
			ctx.globalAlpha = 0.5;
			ctx.lineWidth = 1.5;
			ctx.stroke();
			ctx.globalAlpha = 1;
		}

		for (let i = dead.length - 1; i >= 0; i--) {
			pulses.splice(dead[i], 1);
			spawnPulse(0);
		}
	}

	onMount(() => {
		const ro = new ResizeObserver(() => resize());
		ro.observe(canvas);
		resize();
		animationId = requestAnimationFrame(draw);
		return () => {
			ro.disconnect();
			cancelAnimationFrame(animationId);
		};
	});

</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
    canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
    }
</style>